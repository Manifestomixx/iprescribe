import { useState, useEffect, useRef } from 'react'
import { Container, Typography, Box, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Popover, CircularProgress, Alert } from '@mui/material'
import DashboardLayout from '../layouts/DashboardLayout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label, Sector } from 'recharts'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Icon } from '../components/Icon'
import { getDashboardStats, getRecentPatients } from '../services/dashboard'
import Notification from '../components/Notification'

const CustomTooltip = ({ active, payload, dataKey }) => {
    if (active && payload && payload.length) {
        const data = payload[0]
        const value = data.value
        const payloadName = data.name || data.dataKey
        
        let circleColor = data.color || data.fill || '#3B82F6'
        
        if (!circleColor && data.payload && data.payload.color) {
            circleColor = data.payload.color
        }
        
        const colorMap = {
            'consultations': '#3B82F6',
            'prescriptions': '#4AAF57',
            'doctors': '#FF981F',
            'patients': '#3B82F6',
            'Pediatrics': '#14B8A6',
            'Cardiology': '#FF9900',
            'Surgery': '#3B82F6',
            'Others': '#EC4899'
        }
        
        if (circleColor === '#3B82F6' || !circleColor) {
            if (payloadName && colorMap[payloadName]) {
                circleColor = colorMap[payloadName]
            } else if (dataKey && colorMap[dataKey]) {
                circleColor = colorMap[dataKey]
            }
        }
        
        let displayLabel = 'Consultations'
        const specialtyNames = ['Pediatrics', 'Cardiology', 'Surgery', 'Others']
        if (payloadName && specialtyNames.includes(payloadName)) {
            displayLabel = payloadName
        } else if (dataKey === 'consultations' || payloadName === 'consultations') {
            displayLabel = 'Consultations'
        } else if (dataKey === 'prescriptions' || payloadName === 'prescriptions') {
            displayLabel = 'Prescriptions'
        } else if (dataKey === 'doctors' || payloadName === 'doctors') {
            displayLabel = 'Doctors'
        } else if (dataKey === 'patients' || payloadName === 'patients') {
            displayLabel = 'Patients'
        } else if (dataKey === 'value') {
            if (payloadName && typeof payloadName === 'string' && specialtyNames.includes(payloadName)) {
                displayLabel = payloadName
            } else {
                displayLabel = 'Consultations'
            }
        }
        
        return (
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: '#374151',
                    color: 'white',
                    px: 2,
                    py: 1.5,
                    borderRadius: 1.5,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minWidth: '140px',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #374151',
                    }
                }}
            >
                <Box
                    sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: circleColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <ArrowUpwardIcon 
                        sx={{ 
                            fontSize: 14, 
                            color: 'white',
                            transform: 'rotate(45deg)'
                        }} 
                    />
                </Box>
                <Typography
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'white',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {data.payload?.displayValue !== undefined ? data.payload.displayValue : value} {displayLabel}
                </Typography>
            </Box>
        )
    }
    return null
}

const Dashboard = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [dateRangeAnchor, setDateRangeAnchor] = useState(null);
    const [startDate, setStartDate] = useState('2025-09-12');
    const [endDate, setEndDate] = useState('2025-09-15');
    const pieChartRef = useRef(null);
    const [pieChartSize, setPieChartSize] = useState({ innerRadius: 60, outerRadius: 80 });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [summaryCards, setSummaryCards] = useState([
        { title: 'Total Patients', value: '0', change: '0%', trend: 'down' },
        { title: 'Total Doctors', value: '0', change: '0%', trend: 'down' },
        { title: 'Pending Reviews', value: '0', change: '0%', trend: 'down' },
        { title: 'Total Consultations', value: '0', change: '0%', trend: 'down' },
        { title: 'Prescriptions Issued', value: '0', change: '0%', trend: 'down' },
    ]);
    const [consultationData, setConsultationData] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [specialtiesData, setSpecialtiesData] = useState([
        { name: 'Pediatrics', value: 0, color: '#14B8A6' },
        { name: 'Cardiology', value: 0, color: '#FF9900' },
        { name: 'Surgery', value: 0, color: '#3B82F6' },
        { name: 'Others', value: 0, color: '#EC4899' },
    ]);
    const [tableData, setTableData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
    const [notification, setNotification] = useState(null);
    
    const openDatePicker = (event) => {
        setDateRangeAnchor(event.currentTarget);
    };

    const handleFeatureUnavailable = () => {
        setNotification({
            title: 'Feature Unavailable',
            message: 'This feature is not available yet',
            logo: Icon.notification,
            bgColor: 'bg-white',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-900',
            duration: 4000
        });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const closeDatePicker = () => {
        setDateRangeAnchor(null);
    };

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        // Add ordinal suffix
        const getOrdinal = (n) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        
        return `${getOrdinal(day)} ${month}, ${year}`;
    };

    const dateRangeText = `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const [statsResponse, patientsResponse] = await Promise.all([
                    getDashboardStats(startDate, endDate).catch(() => null),
                    getRecentPatients(startDate, endDate).catch(() => null),
                ]);

                if (statsResponse && statsResponse.data) {
                    const data = statsResponse.data;

                    setSummaryCards([
                        { 
                            title: 'Total Patients', 
                            value: String(data.patients?.total_patients || 0), 
                            change: `${data.patients?.patients_percentage_since_last_week || 0}%`, 
                            trend: data.patients?.positive ? 'up' : 'down' 
                        },
                        { 
                            title: 'Total Doctors', 
                            value: String(data.doctors?.total_doctors || 0), 
                            change: `${data.doctors?.doctors_percentage_since_last_week || 0}%`, 
                            trend: data.doctors?.positive ? 'up' : 'down' 
                        },
                        { 
                            title: 'Pending Reviews', 
                            value: String(data.pending_reviews?.total_pending_reviews || 0), 
                            change: `${data.pending_reviews?.pending_reviews_percentage_since_last_week || 0}%`, 
                            trend: data.pending_reviews?.positive ? 'up' : 'down' 
                        },
                        { 
                            title: 'Total Consultations', 
                            value: String(data.consultations?.total_consultations || 0), 
                            change: `${data.consultations?.consultations_percentage_since_last_week || 0}%`, 
                            trend: data.consultations?.positive ? 'up' : 'down' 
                        },
                        { 
                            title: 'Prescriptions Issued', 
                            value: String(data.prescriptions?.total_prescriptions || 0), 
                            change: `${data.prescriptions?.prescriptions_percentage_since_last_week || 0}%`, 
                            trend: data.prescriptions?.positive ? 'up' : 'down' 
                        },
                    ]);

                    if (data.consultationOverTime && Array.isArray(data.consultationOverTime)) {
                        const mappedConsultationData = data.consultationOverTime.map(item => ({
                            month: item.month,
                            consultations: item.count || item.consultations || 0
                        }));
                        setConsultationData(mappedConsultationData);
                    }

                    if (data.prescriptionVolumeTrend && Array.isArray(data.prescriptionVolumeTrend)) {
                        const mappedPrescriptionData = data.prescriptionVolumeTrend.map(item => ({
                            month: item.month,
                            prescriptions: item.count || item.prescriptions || 0
                        }));
                        setPrescriptionData(mappedPrescriptionData);
                    }

                    if (data.active_doctors_vs_patients) {
                        const { categories, series } = data.active_doctors_vs_patients;
                        
                        const activeChartData = categories?.map((category, index) => {
                            return {
                                month: category,
                                doctors: series?.[0]?.data?.[index] || 0,
                                patients: series?.[1]?.data?.[index] || 0,
                            };
                        }) || [];
                        
                        setActiveData(activeChartData);
                    } else {
                        const patientsThisWeek = data.patients?.patients_this_week || 0;
                        const doctorsThisWeek = data.doctors?.doctors_this_week || 0;
                        
                        const activeChartData = [{
                            month: 'This Week',
                            doctors: doctorsThisWeek,
                            patients: patientsThisWeek
                        }];
                        
                        setActiveData(activeChartData);
                    }

                    if (data.top_specialities_in_demand && Array.isArray(data.top_specialities_in_demand)) {
                        const specialtiesColors = ['#14B8A6', '#FF9900', '#3B82F6', '#EC4899'];
                        
                        let mappedSpecialties = data.top_specialities_in_demand.map((item, index) => {
                            const specialityName = item.speciality || item.name;
                            const actualValue = item.count || item.value || 0;
                            return {
                                name: specialityName && specialityName.trim() !== '' 
                                    ? specialityName 
                                    : `Specialty ${index + 1}`,
                                value: actualValue,
                                displayValue: actualValue,
                                color: specialtiesColors[index % specialtiesColors.length]
                            };
                        });
                        
                        const allZero = mappedSpecialties.every(item => item.value === 0);
                        if (allZero && mappedSpecialties.length > 0) {
                            mappedSpecialties = mappedSpecialties.map(item => ({
                                ...item,
                                value: 1,
                                displayValue: 0
                            }));
                        }
                        
                        setSpecialtiesData(mappedSpecialties);
                    }
                }

                if (patientsResponse) {
                    const patientsData = patientsResponse.data?.data || [];
                    
                    setTableData(patientsData.sort((a, b) => {
                        const dateA = new Date(a.created_at || a.createdAt || 0);
                        const dateB = new Date(b.created_at || b.createdAt || 0);
                        return dateB - dateA;
                    }));
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [startDate, endDate]);

    useEffect(() => {
        const updatePieChartSize = () => {
            if (pieChartRef.current) {
                const container = pieChartRef.current;
                const width = container.offsetWidth;
                const height = container.offsetHeight || 200;
                const minDimension = Math.min(width, height);
                const innerRadius = Math.max(30, minDimension * 0.25);
                const outerRadius = Math.max(40, minDimension * 0.35);
                setPieChartSize({ 
                    innerRadius,
                    outerRadius
                });
            }
        };

        updatePieChartSize();
        window.addEventListener('resize', updatePieChartSize);
        return () => window.removeEventListener('resize', updatePieChartSize);
    }, []);

    // Filter chart data based on date range
    const getMonthIndex = (monthName) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(monthName);
    };

    const filterChartData = (data, year = 2025) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return data.filter(item => {
            const monthIndex = getMonthIndex(item.month);
            const itemDate = new Date(year, monthIndex, 1);
            return itemDate >= start && itemDate <= end;
        });
    };

    const filteredConsultationData = consultationData.length > 0 ? filterChartData(consultationData) : consultationData;
    const filteredPrescriptionData = prescriptionData.length > 0 ? filterChartData(prescriptionData) : prescriptionData;
    const filteredActiveData = activeData.length > 0 ? filterChartData(activeData) : activeData;

    const handleSort = (column) => {
        if (sortConfig.column === column) {
            setSortConfig({ 
                column, 
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' 
            });
        } else {
            setSortConfig({ column, direction: 'asc' });
        }
    };

    const sortedTableData = [...tableData].sort((a, b) => {
        if (!sortConfig.column) return 0;

        let aValue, bValue;

        switch (sortConfig.column) {
            case 'id':
                aValue = a.id || 0;
                bValue = b.id || 0;
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            
            case 'signUpDate':
                aValue = new Date(a.created_at || a.createdAt || 0);
                bValue = new Date(b.created_at || b.createdAt || 0);
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            
            case 'patientName': {
                const aName = [
                    a.first_name,
                    a.middle_name,
                    a.last_name
                ].filter(part => part && part.trim() !== '').join(' ') || a.patientName || a.patient_name || a.name || '';
                const bName = [
                    b.first_name,
                    b.middle_name,
                    b.last_name
                ].filter(part => part && part.trim() !== '').join(' ') || b.patientName || b.patient_name || b.name || '';
                return sortConfig.direction === 'asc' 
                    ? aName.localeCompare(bName)
                    : bName.localeCompare(aName);
            }
            
            case 'email':
                aValue = (a.email || a.email_address || '').toLowerCase();
                bValue = (b.email || b.email_address || '').toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            
            case 'phone':
                aValue = (a.phone || a.phone_number || a.mobile || '').toString();
                bValue = (b.phone || b.phone_number || b.mobile || '').toString();
                return sortConfig.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            
            case 'lastSeen':
                aValue = new Date(a.last_seen || a.last_seen_at || a.lastSeen || 0);
                bValue = new Date(b.last_seen || b.last_seen_at || b.lastSeen || 0);
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            
            case 'location':
                aValue = (a.location || a.address || a.city || '').toLowerCase();
                bValue = (b.location || b.address || b.city || '').toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            
            case 'device':
                aValue = (a.device || a.device_type || a.platform || '').toLowerCase();
                bValue = (b.device || b.device_type || b.platform || '').toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            
            case 'status':
                aValue = (a.status || a.verification_status || 'Verified').toLowerCase();
                bValue = (b.status || b.verification_status || 'Verified').toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            
            default:
                return 0;
        }
    });

    return (
        <DashboardLayout>
            <Container maxWidth={false} sx={{ 
                py: { xs: 2, md: 4 }, 
                px: { xs: 1.5, sm: 2, md: 3 }, 
                minHeight: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
            }} className='bg-white'>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '100%' }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && (
                <>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'flex-start' }, 
                    mb: { xs: 2, md: 4 },
                    gap: { xs: 2, md: 0 }
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Latest update for the last 7 days. check now
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        justifyContent: { xs: 'space-between', sm: 'flex-start' },
                        gap: { xs: 1, sm: 2 }, 
                        alignItems: 'center',
                        width: { xs: '100%', md: 'auto' },
                        flexWrap: 'wrap'
                    }}>
                        <Box 
                            onClick={openDatePicker}
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'flex-start',
                                gap: 1, 
                                px: { xs: 1, sm: 2 }, 
                                py: { xs: 1, sm: 1 }, 
                                border: '1px solid #DCE4E8', 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                cursor: 'pointer',
                                flex: { xs: '0 0 auto', sm: '1 1 auto' },
                                minWidth: { xs: 'auto', sm: '200px' },
                                '&:hover': {
                                    bgcolor: '#f5f5f5'
                                }
                            }}
                        >
                            <img src={Icon.calendar} alt="calender-icon" />
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                                    whiteSpace: 'nowrap',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                {dateRangeText}
                            </Typography>
                        </Box>
                        <Popover
                            open={Boolean(dateRangeAnchor)}
                            anchorEl={dateRangeAnchor}
                            onClose={closeDatePicker}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: { xs: 'center', sm: 'left' },
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: { xs: 'center', sm: 'left' },
                            }}
                            sx={{
                                '& .MuiPopover-paper': {
                                    maxWidth: { xs: '90vw', sm: 'none' }
                                }
                            }}
                        >
                            <Box sx={{ 
                                p: { xs: 2, sm: 3 }, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2, 
                                minWidth: { xs: 280, sm: 300 },
                                maxWidth: { xs: '90vw', sm: 'none' }
                            }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>Select Date Range</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Start Date</Typography>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                if (new Date(e.target.value) > new Date(endDate)) {
                                                    setEndDate(e.target.value);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #DCE4E8',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>End Date</Typography>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                const newEndDate = e.target.value;
                                                if (new Date(newEndDate) >= new Date(startDate)) {
                                                    setEndDate(newEndDate);
                                                }
                                            }}
                                            min={startDate}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #DCE4E8',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button 
                                        variant="outlined" 
                                        onClick={closeDatePicker}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        onClick={closeDatePicker}
                                        sx={{ 
                                            textTransform: 'none',
                                            backgroundColor: '#283C85',
                                            '&:hover': {
                                                backgroundColor: '#1e2d6b'
                                            }
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Box>
                        </Popover>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                textTransform: 'none', 
                                backgroundColor: '#283C85', 
                                color: 'white', 
                                borderRadius: '10px', 
                                padding: { xs: '10px 16px', sm: '10px 20px' },
                                flex: { xs: '0 0 auto', sm: '0 0 auto' },
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Export
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                        xs: 'repeat(2, 1fr)', 
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(3, 1fr)', 
                        lg: 'repeat(5, 1fr)' 
                    }, 
                    gap: { xs: 1.5, sm: 2 }, 
                    mb: { xs: 2, md: 4 } 
                }}>
                    {summaryCards.map((card, index) => {
                        const cardColors = [
                            { bg: '#F9F4FF', iconBg: '#0EA5E914' }, // Blue - Total Patients
                            { bg: '#F6FAFD', iconBg: '#10B98114' }, // Green - Total Doctors
                            { bg: '#FFF8ED', iconBg: '#4CBD9114' }, // Yellow - Pending Reviews
                            { bg: '#F9F4FF', iconBg: '#4CBD9114' }, // Pink - Total Consultations
                            { bg: '#F2FFFC', iconBg: '#FFFAE1' }, // Purple - Prescriptions Issued
                        ]
                        const color = cardColors[index]
                        return (
                            <Card key={index} sx={{ position: 'relative', borderRadius: 2, bgcolor: color.bg, boxShadow: 'none' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: "medium" }}>
                                            {card.title}
                                        </Typography>
                                        <div className='p-1' style={{ backgroundColor: color.iconBg }}>    
                                        <img src={Icon.people} alt="people-icon" />
                                        </div>
                            
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                                        {card.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {card.trend === 'up' ? (
                                            <ArrowUpwardIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                        ) : (
                                            <ArrowDownwardIcon sx={{ fontSize: 14, color: 'error.main' }} />
                                        )}
                                        <Typography variant="caption" sx={{ color: card.trend === 'up' ? 'success.main' : 'error.main' }}>
                                            {card.change} <span className='text-xs text-gray-500'>Since last week</span>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Box>

                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 2, 
                    mb: 2 
                }}>
                    <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #EBEBEB' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: '#6C7278' }}>
                                    Consultation Over Time
                                </Typography>
                                <img 
                                    src={Icon.more} 
                                    alt="more-icon" 
                                    className='cursor-pointer' 
                                    onClick={handleFeatureUnavailable}
                                />
                            </Box>
                            <ResponsiveContainer width="100%" height={250} >
                                <LineChart data={filteredConsultationData.length > 0 ? filteredConsultationData : consultationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666"  />
                                    <YAxis stroke="#666" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                                    <Tooltip content={<CustomTooltip dataKey="consultations" />} />
                                    <Line type="monotone" dataKey="consultations" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} backgroundColor="blue"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #EBEBEB' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: '#6C7278' }}>
                                    Prescription Volume Trend
                                </Typography>
                                <img 
                                    src={Icon.more} 
                                    alt="more-icon" 
                                    className='cursor-pointer' 
                                    onClick={handleFeatureUnavailable}
                                />
                            </Box>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={filteredPrescriptionData.length > 0 ? filteredPrescriptionData : prescriptionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666" />
                                    <YAxis stroke="#666" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                                    <Tooltip content={<CustomTooltip dataKey="prescriptions" />} />
                                    <Line type="monotone" dataKey="prescriptions" stroke="#4AAF57" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 2, 
                    mb: { xs: 2, md: 4 } 
                }}>
                    {/* Active Doctors vs Active Patients */}
                    <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #EBEBEB' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '14px', color: '#6C7278' }}>
                                Active Doctors vs Active Patients
                            </Typography>
                            <Box sx={{ display: 'flex', gap:2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#F97316' }} />
                                    <Typography variant="caption">Doctors</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                                    <Typography variant="caption">Patients</Typography>
                                </Box>
                            </Box>

                            </Box>
                            
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={filteredActiveData.length > 0 ? filteredActiveData : activeData} barCategoryGap="20%" barGap={1}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666" />
                                    <YAxis 
                                        stroke="#666" 
                                        domain={[0, 'dataMax + 10']} 
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="patients" fill="#00A9F1" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="doctors" fill="#FF981F" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #EBEBEB' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: '#6C7278' }}>
                                    Top Specialties in Demand
                                </Typography>
                                <img 
                                    src={Icon.more} 
                                    alt="more-icon" 
                                    className='cursor-pointer' 
                                    onClick={handleFeatureUnavailable}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative', flexDirection: { xs: 'column', md: 'row' } }}>
                                <Box 
                                    ref={pieChartRef}
                                    sx={{ 
                                        width: { xs: '100%', md: '50%' }, 
                                        position: 'relative', 
                                        height: { xs: 250, sm: 200, md: 200 },
                                        minHeight: 200
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                <linearGradient id="gradientGreen" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#0D9488" stopOpacity={1} />
                                                </linearGradient>
                                                <linearGradient id="gradientOrange" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#FF9900" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#FFD480" stopOpacity={1} />
                                                </linearGradient>
                                                <linearGradient id="gradientBlue" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#2563EB" stopOpacity={1} />
                                                </linearGradient>
                                                <linearGradient id="gradientPink" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#DB2777" stopOpacity={1} />
                                                </linearGradient>
                                            </defs>
                                            <Pie
                                                data={specialtiesData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={pieChartSize.innerRadius || '25%'}
                                                outerRadius={pieChartSize.outerRadius || '35%'}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                                activeIndex={activeIndex}
                                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                                onMouseLeave={() => setActiveIndex(null)}
                                                shape={(props) => {
                                                    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props;
                                                    // Convert percentage strings to numbers if needed
                                                    const baseOuterRadius = typeof outerRadius === 'string' 
                                                        ? parseFloat(outerRadius) 
                                                        : outerRadius;
                                                    const baseInnerRadius = typeof innerRadius === 'string'
                                                        ? parseFloat(innerRadius)
                                                        : innerRadius;
                                                    
                                                    // Calculate responsive adjustments based on base radius
                                                    const adjustmentFactor = baseOuterRadius * 0.2; // 20% of base radius
                                                    
                                                    // Make the orange slice (Cardiology, index 1) bigger than green (Pediatrics, index 0)
                                                    // Make the blue slice (Surgery, index 2) bigger than red/pink (Others, index 3)
                                                    const isOrangeSlice = index === 1;
                                                    const isGreenSlice = index === 0;
                                                    const isBlueSlice = index === 2;
                                                    const isRedSlice = index === 3;
                                                    const isHovered = activeIndex === index;
                                                    let adjustedOuterRadius = baseOuterRadius;
                                                    if (isOrangeSlice) {
                                                        adjustedOuterRadius = baseOuterRadius + adjustmentFactor * 0.8; // Orange is biggest
                                                    } else if (isGreenSlice) {
                                                        adjustedOuterRadius = baseOuterRadius + adjustmentFactor * 0.4; // Green is medium
                                                    } else if (isBlueSlice) {
                                                        adjustedOuterRadius = baseOuterRadius + adjustmentFactor * 0.6; // Blue is bigger than red
                                                    } else if (isRedSlice) {
                                                        adjustedOuterRadius = baseOuterRadius + adjustmentFactor * 0.2; // Red is smallest of the adjusted ones
                                                    }
                                                    // Scale up when hovered
                                                    if (isHovered) {
                                                        adjustedOuterRadius += adjustmentFactor * 0.25;
                                                    }
                                                    return (
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={baseInnerRadius}
                                                            outerRadius={adjustedOuterRadius}
                                                            startAngle={startAngle}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                        />
                                                    );
                                                }}
                                            >
                                                {specialtiesData.map((entry, index) => {
                                                    const gradientMap = {
                                                        0: 'url(#gradientGreen)',
                                                        1: 'url(#gradientOrange)',
                                                        2: 'url(#gradientBlue)',
                                                        3: 'url(#gradientPink)'
                                                    };
                                                    return <Cell key={`cell-${index}`} fill={gradientMap[index]} />;
                                                })}
                                                <Label
                                                    value={(() => {
                                                        const total = specialtiesData.reduce((sum, item) => {
                                                            const value = item.displayValue !== undefined ? item.displayValue : item.value;
                                                            return sum + value;
                                                        }, 0);
                                                        
                                                        let percentage = 0;
                                                        if (total > 0) {
                                                            const maxValue = Math.max(...specialtiesData.map(item => {
                                                                return item.displayValue !== undefined ? item.displayValue : item.value;
                                                            }));
                                                            percentage = Math.round((maxValue / total) * 100);
                                                        }
                                                        
                                                        return `${percentage}%`;
                                                    })()}
                                                    position="center"
                                                    style={{
                                                        fontSize: 'clamp(16px, 2vw, 24px)',
                                                        fontWeight: 600,
                                                        fill: '#4B5563',
                                                        fontFamily: 'inherit'
                                                    }}
                                                />
                                            </Pie>
                                            <Tooltip content={<CustomTooltip dataKey="value" />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                   
                                </Box>
                                <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', md: '50%' } }}>
                                    {specialtiesData.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5, width: { xs: '100%', sm: 'calc(50% - 8px)', md: '50%' }, flexDirection: 'column' }}>
                                            <Typography variant="body2" sx={{ flex: 1, fontSize: { xs: '11px', sm: '12px' }, color: '#6C7278' }}>
                                                {item.name}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '11px', sm: '14px' } }}>
                                                {item.displayValue !== undefined ? item.displayValue : item.value}
                                            </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                                Recent Patients Sign Up
                            </Typography>
                            <Button 
                                variant="text" 
                                sx={{ textTransform: 'none', color: '#1A1C1E' }}
                                onClick={handleFeatureUnavailable}
                            >
                                See All &gt;
                            </Button>
                        </Box>
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                #
                                                <button 
                                                    onClick={() => handleSort('id')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by ID"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'id' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Sign Up Date
                                                <button 
                                                    onClick={() => handleSort('signUpDate')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Sign Up Date"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'signUpDate' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Patient Name
                                                <button 
                                                    onClick={() => handleSort('patientName')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Patient Name"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'patientName' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Email Address
                                                <button 
                                                    onClick={() => handleSort('email')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Email"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'email' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Phone Number
                                                <button 
                                                    onClick={() => handleSort('phone')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Phone"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'phone' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Last Seen Date & T
                                                <button 
                                                    onClick={() => handleSort('lastSeen')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Last Seen"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'lastSeen' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Location
                                                <button 
                                                    onClick={() => handleSort('location')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Location"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'location' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Device
                                                <button 
                                                    onClick={() => handleSort('device')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Device"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'device' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: '#EEF2FF' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Status
                                                <button 
                                                    onClick={() => handleSort('status')}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    aria-label="Sort by Status"
                                                >
                                                    <img 
                                                        src={Icon.arrowDown} 
                                                        alt="sort" 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            transition: 'transform 0.2s',
                                                            transform: sortConfig.column === 'status' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
                                                        }}
                                                    />
                                                </button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.length === 0 && !loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    No patients found for the selected date range
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedTableData.map((row, index) => {
                                            // Handle API response fields
                                            const signUpDate = row.created_at || row.createdAt || row.signUpDate || row.sign_up_date || '';
                                            // Construct patient name from first_name, middle_name, last_name
                                            const nameParts = [
                                                row.first_name,
                                                row.middle_name,
                                                row.last_name
                                            ].filter(part => part && part.trim() !== '');
                                            const patientName = nameParts.length > 0 
                                                ? nameParts.join(' ') 
                                                : row.patientName || row.patient_name || row.name || 'N/A';
                                            
                                            const email = row.email || row.email_address || '';
                                            const phone = row.phone || row.phone_number || row.mobile || '';
                                            const lastSeen = row.last_seen || row.last_seen_at || row.lastSeen || '';
                                            const location = row.location || row.address || row.city || '';
                                            const device = row.device || row.device_type || row.platform || '';
                                            const status = row.status || row.verification_status || 'Verified';
                                            
                                            // Format date if it exists
                                            const formatDate = (dateString) => {
                                                if (!dateString) return '';
                                                try {
                                                    const date = new Date(dateString);
                                                    return date.toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    });
                                                } catch {
                                                    return dateString;
                                                }
                                            };
                                            
                                            // Get status color based on status value
                                            const getStatusColor = (statusValue) => {
                                                const statusLower = (statusValue || '').toLowerCase();
                                                
                                                // Status color mapping
                                                if (statusLower.includes('verified') || statusLower.includes('active') || statusLower.includes('approved')) {
                                                    return { bgcolor: '#ECF8F0CC', color: '#1C8C6E' }; // Green
                                                } else if (statusLower.includes('pending') || statusLower.includes('waiting')) {
                                                    return { bgcolor: '#FFF4E6', color: '#F59E0B' };
                                                } else if (statusLower.includes('inactive') || statusLower.includes('suspended')) {
                                                    return { bgcolor: '#FEE2E2', color: '#EF4444' };
                                                } else if (statusLower.includes('rejected') || statusLower.includes('declined')) {
                                                    return { bgcolor: '#F3F4F6', color: '#6B7280' };
                                                } else {
                                                    return { bgcolor: '#EFF6FF', color: '#3B82F6' };
                                                }
                                            };
                                            
                                            const statusColors = getStatusColor(status);
                                            
                                            return (
                                                <TableRow key={row.id || index} hover sx={{ bgcolor: index % 2 === 0 ? '#FFFFFF' : '#EEF2FF' }}>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{row.id || index + 1}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit', whiteSpace: 'nowrap' }}>{formatDate(signUpDate)}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{patientName}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{email || 'N/A'}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{phone || 'N/A'}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit', whiteSpace: 'nowrap' }}>{formatDate(lastSeen) || 'N/A'}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{location || 'N/A'}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>{device || 'N/A'}</TableCell>
                                                    <TableCell sx={{ bgcolor: 'inherit' }}>
                                                        <Chip 
                                                            label={status} 
                                                            sx={{ 
                                                                bgcolor: statusColors.bgcolor, 
                                                                color: statusColors.color, 
                                                                borderRadius: '5px',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                </>
                )}
            </Container>
            {notification && (
                <Notification 
                    notification={notification} 
                    onClose={handleCloseNotification} 
                />
            )}
        </DashboardLayout>
    )
}

export default Dashboard;
