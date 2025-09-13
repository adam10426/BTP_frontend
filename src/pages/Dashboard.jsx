import { Paper, Card, Text, Title, Stack, Group, ThemeIcon, rem, Flex, TextInput, Button, NumberInput, FileButton, useMatches, Badge, SimpleGrid, Divider, ActionIcon } from '@mantine/core';
import { IconUsers, IconSearch, IconUpload, IconX, IconClockHour4, IconArrowRight, IconPhone, IconBrandWhatsapp } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react'
import { useDebouncedValue } from '@mantine/hooks';
import { processXLSXFile } from '../utils/xlsx.utils';
import userService from '../db/services/userService';
import ReceiptModal from '../components/ReceiptModal';
import WaitingListModal from '../components/WaitingListModal';

const Dashboard = () => {
    const [ITS, setITS] = useState('')
    const [debouncedITS] = useDebouncedValue(ITS, 500)
    const [fileKey, setFileKey] = useState(Date.now());
    const fileInputRef = useRef(null);
    const [searchedUser, setSearchedUser] = useState(null)
    const [receiptModalOpened, setReceiptModalOpened] = useState(false)
    const [waitingListModalOpened, setWaitingListModalOpened] = useState(false)
    const fullWidth = useMatches({base:true, 'xs':false})
    const searchWidth = useMatches({base:'100%', 'xs':'40%'})

    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalRegistered: 0,
        totalConfirmed: 0
    });

    const showNotification = ({ title, message, color }) => {
        // This is a placeholder - in a real app, you would use a notification system like @mantine/notifications
        console.log(`[${title}] ${message}`);
    };

    // Load stats on component mount
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const users = await userService.getAllUsers();
            setStats({
                totalRegistered: users.length,
                totalPending: users.filter(u => u.status === 'pending').length,
                totalConfirmed: users.filter(u => u.status === 'confirmed').length,
                totalWaiting: users.filter(u => u.status === 'waiting').length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const setFile = async (file) => {
        if (!file) return;
        
        setIsLoading(true);
        try {
            const {users, verifiedUsers} = await processXLSXFile(file);
            console.log("Processed XLSX data:", data);
            
            // Import users to IndexedDB
            await userService.importUsersFromXLSX(data);
            
            // Refresh stats
            await loadStats();
            
            // Show success message
            showNotification({
                title: 'Success',
                message: `${data.length} users imported successfully`,
                color: 'green'
            });
            
            // Reset file input to allow re-uploading the same file
            setFileKey(Date.now());
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Error processing file:", error);
            showNotification({
                title: 'Error',
                message: 'Failed to import users: ' + (error.message || 'Unknown error'),
                color: 'red'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleMoveToWaitingList = async () => {
        try {
            await userService.updateUser(searchedUser.its, { 
                status: 'waiting',
                updatedAt: new Date()
            });
            setSearchedUser({...searchedUser, status: 'waiting'});
            showNotification({
                title: 'Moved to waiting list',
                message: `${searchedUser?.name} has been moved to the waiting list`,
                color: 'orange'
            });
            // Update stats
            loadStats();
            setWaitingListModalOpened(false);
        } catch (error) {
            console.error('Error moving to waiting list:', error);
            showNotification({
                title: 'Error',
                message: 'Failed to move to waiting list',
                color: 'red'
            });
        }
    };

    // Search function with debouncing
    useEffect(() => {
        ;(async () => {
            if (debouncedITS) {
                try {
                    const user = await userService.getUserByIts(debouncedITS);
                    console.log("USERS")
                    setSearchedUser(user || null);
                } catch (error) {
                    console.error('Error searching user:', error);
                    setSearchedUser(null);
                }
            } else {
                setSearchedUser(null);
            }
        })();
        
        // searchUser();
    }, [debouncedITS])

    const handleProceed = () => {
        setReceiptModalOpened(true);
    }

    const handleReceiptSubmit = async (userId, receiptNumber) => {
        try {
            await userService.updateUser(userId, { 
                receiptNumber,
                status: 'confirmed',
                updatedAt: new Date()
            });
            // Refresh the user data
            const updatedUser = await userService.getUserByIts(userId);
            setSearchedUser(updatedUser);
            // Update stats
            loadStats();
        } catch (error) {
            console.error('Error updating receipt:', error);
            throw error;
        }
    }

    const MuminDetailsNotFound = () => {
        return(
            <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg" shadow="sm" mt="md">
                <Stack align="center" justify="center" style={{ minHeight: 'calc(100vh - 400px)' }}>
                    <ThemeIcon variant="light" color="gray" size={64} radius={32} mb="md">
                        <IconSearch size={32} />
                    </ThemeIcon>
                    <Text size="xl" fw={500} c="dimmed">No User Found</Text>
                    <Text c="dimmed" ta="center" maw={400}>
                        Try searching with a different ITS number or upload a source file to get started.
                    </Text>
                </Stack>
            </Card>
        )
    }

    return (
        <>
            <ReceiptModal
                opened={receiptModalOpened}
                onClose={() => setReceiptModalOpened(false)}
                userId={searchedUser?.its}
                onReceiptSubmit={handleReceiptSubmit}
            />
            <WaitingListModal
                opened={waitingListModalOpened}
                onClose={() => setWaitingListModalOpened(false)}
                onConfirm={handleMoveToWaitingList}
                userName={searchedUser?.name}
            />
            <Paper w="100%" pt={24}>
                <Stack gap={24}>
                <Flex direction={{base:'column', 'xs':'row'}} gap={24}>
                    <Card withBorder p="md" radius="md" w={{base:'100%', 'xs':300}}>
                        <Group position="apart" mb="xs">
                            <Text size="md" c="dimmed" fw={500}>
                                Registered Mumineen
                            </Text>
                            <ThemeIcon color="blue" variant="light" size={32} radius="md">
                                <IconUsers style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Group>
                        <Group align="flex-end" spacing="xs">
                            <Text size="1.75rem" fw={700}>
                                {stats.totalRegistered}
                            </Text>
                        </Group>
                    </Card>
                    <Card withBorder p="md" radius="md" w={{base:'100%', 'xs':300}}>
                        <Group position="apart" mb="xs">
                            <Text size="md" c="dimmed" fw={500}>
                                Confirmed Mumineen
                            </Text>
                            <ThemeIcon color="green" variant="light" size={32} radius="md">
                                <IconUsers style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Group>
                        <Group align="flex-end" spacing="xs">
                            <Text size="1.75rem" fw={700}>
                                {stats.totalConfirmed}
                            </Text>
                        </Group>
                    </Card>
                    <Card withBorder p="md" radius="md" w={{base:'100%', 'xs':300}}>
                        <Group position="apart" mb="xs">
                            <Text size="md" c="dimmed" fw={500}>
                                Pending Mumineen
                            </Text>
                            <ThemeIcon color="blue" variant="light" size={32} radius="md">
                                <IconUsers style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Group>
                        <Group align="flex-end" spacing="xs">
                            <Text size="1.75rem" fw={700}>
                                {stats.totalPending}
                            </Text>
                        </Group>
                    </Card>
                    <Card withBorder p="md" radius="md" w={{base:'100%', 'xs':300}}>
                        <Group position="apart" mb="xs">
                            <Text size="md" c="dimmed" fw={500}>
                                Waiting List
                            </Text>
                            <ThemeIcon color="blue" variant="light" size={32} radius="md">
                                <IconUsers style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Group>
                        <Group align="flex-end" spacing="xs">
                            <Text size="1.75rem" fw={700}>
                                {stats.totalWaiting}
                            </Text>
                        </Group>
                    </Card>
                </Flex>
                <Flex direction={{base:'column', 'xs':'row'}} gap={24}>
                    <NumberInput 
                        w={searchWidth} 
                        value={ITS}
                        onChange={(value) => setITS(value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && ITS) {
                                setITS(ITS)
                            }
                        }}
                        allowDecimal={false}
                        placeholder="Search by ITS number"
                        leftSection={<IconSearch size={16} />}
                        rightSection={<></>}
                        radius="md"
                        size="md"
                        
                        
                    />
                    <Group ml={{base:0, 'xs':'auto'}}>
                        <FileButton 
                            key={fileKey}
                            onChange={setFile} 
                            accept=".xlsx, .xls"
                            disabled={isLoading}
                            ref={fileInputRef}
                        >
                            {(props) => (
                                <Button 
                                    variant="outline" 
                                    leftSection={<IconUpload size={16} />} 
                                    loading={isLoading}
                                    fullWidth={fullWidth} 
                                    {...props}
                                >
                                    {isLoading ? 'Uploading...' : 'Upload Source File'}
                                </Button>
                            )}
                        </FileButton>
                    </Group>
                </Flex>
                {searchedUser?.its ? (
                    <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg" shadow="sm" mt="md">
                        <Stack gap="xl" style={{ minHeight: 'calc(100vh - 400px)' }}>
                            <Flex justify="space-between" align="center" pb="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                                <Title order={3} fw={700} c="dark.4">Mumin Details</Title>
                                <Group gap="xs">
                                    <Badge 
                                        color={searchedUser?.status === 'waiting' ? 'orange' : (searchedUser?.receiptNumber ? 'green' : 'yellow')} 
                                        variant="light" 
                                        radius="sm"
                                        size="lg"
                                    >
                                        {searchedUser?.status === 'waiting' ? 'Waiting' : (searchedUser?.receiptNumber ? 'Paid' : 'Pending')}
                                        {searchedUser?.receiptNumber && searchedUser?.status === 'confirmed' && ` #${searchedUser.receiptNumber}`}
                                    </Badge>
                                </Group>
                            </Flex>
                            
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" verticalSpacing="md">
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Full Name</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.name || '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Husband/Father Name</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.fatherOrHusbandName || '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Surname</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.surname || '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>ITS Number</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.its || '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Gender</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.gender ? `${searchedUser.gender}${searchedUser?.age ? `, ${searchedUser.age} years` : ''}` : '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Mohallah</Text>
                                    <Text fw={500} fz="md">
                                        {searchedUser?.mohallah || '—'}
                                    </Text>
                                </div>
                                
                                <div>
                                    <Text c="dimmed" fz="sm" mb={4}>Contact</Text>
                                    <Group gap="sm">
                                        <Text fw={500} fz="md">
                                            {searchedUser?.whatsAppNumber || '—'}
                                        </Text>
                                        {searchedUser?.whatsAppNumber && (
                                            <ActionIcon 
                                                variant="subtle" 
                                                color="blue" 
                                                size="sm"
                                                component="a"
                                                href={`https://wa.me/${searchedUser.whatsAppNumber.replace(/\D/g, '')}`}
                                                target="_blank"
                                            >
                                                <IconBrandWhatsapp size={18} />
                                            </ActionIcon>
                                        )}
                                    </Group>
                                </div>
                            </SimpleGrid>
                            
                            <Divider my="sm" />
                            
                            <Group justify="flex-end" mt="auto" gap="md">
                                <Button 
                                    variant="light" 
                                    color="gray"
                                    leftSection={<IconX size={18} />}
                                    onClick={() => {
                                        setITS('')
                                        setSearchedUser(null)
                                    }}
                                    radius="md"
                                >
                                    Clear
                                </Button>
                                
                                <Button 
                                    variant="light" 
                                    color="orange"
                                    leftSection={<IconClockHour4 size={18} />}
                                    disabled={!searchedUser}
                                    onClick={() => setWaitingListModalOpened(true)}
                                    radius="md"
                                >
                                    Move to Waiting List
                                </Button>
                                
                                <Button 
                                    rightSection={<IconArrowRight size={18} />}
                                    disabled={!searchedUser}
                                    onClick={handleProceed}
                                    radius="md"
                                >
                                    Proceed
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                ) : (
                   <MuminDetailsNotFound />
                )}
                </Stack>
            </Paper>
        </>
    );
}

export default Dashboard;