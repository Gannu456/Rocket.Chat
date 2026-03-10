// import type { IActivityHistory } from '@rocket.chat/core-typings';
import { Box, Button, ButtonGroup, Icon, Throbber } from '@rocket.chat/fuselage';
import { Page, PageHeader, PageScrollableContentWithShadow } from '@rocket.chat/ui-client';
import { useEndpoint, useToastMessageDispatch, useTranslation } from '@rocket.chat/ui-contexts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactElement } from 'react';

const AccountHistoryPage = (): ReactElement => {
    const t = useTranslation();
    
    const queryClient = useQueryClient();
    const dispatchToastMessage = useToastMessageDispatch();

    // Setup API Connectors
    const getActivityHistory = useEndpoint('GET', '/v1/users.getActivityHistory');
    const removeItemEndpoint = useEndpoint('POST', '/v1/users.removeActivityHistoryItem');
    const clearHistoryEndpoint = useEndpoint('POST', '/v1/users.clearActivityHistory');

    // Fetch the Data
    const { data, isLoading, isError } = useQuery({
        queryKey: ['activityHistory'], 
        queryFn: () => getActivityHistory({ count: 50, offset: 0 })
    });

    // Define Mutations
    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => removeItemEndpoint({ itemId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activityHistory'] });
            dispatchToastMessage({ type: 'success', message: t('Item_removed') });
        },
        onError: (error) => dispatchToastMessage({ type: 'error', message: String(error) }),
    });

    const clearHistoryMutation = useMutation({
        mutationFn: () => clearHistoryEndpoint({}), // Pass the empty object here!
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activityHistory'] });
            dispatchToastMessage({ type: 'success', message: t('History_cleared') });
        },
        onError: (error) => dispatchToastMessage({ type: 'error', message: String(error) }),
    });

    return (
        <Page>
            <PageHeader title={t('Activity_History')}>
                <ButtonGroup>
                    <Button 
                        danger 
                        onClick={() => clearHistoryMutation.mutate()} 
                        disabled={clearHistoryMutation.isPending || !data?.history?.length}
                    >
                        {t('clear_history')}
                    </Button>
                </ButtonGroup>
            </PageHeader>

            <PageScrollableContentWithShadow>
                <Box maxWidth='x600' w='full' alignSelf='center' p='x24'>
                    {/* Loading & Error States */}
                    {isLoading && <Throbber />}
                    {isError && <Box color='danger'>{t('Error_loading_history')}</Box>}
                    
                    {/* Empty State */}
                    {!isLoading && data?.history?.length === 0 && (
                        <Box textAlign='center' color='hint' p='x24'>
                            {t('No_recent_activity')}
                        </Box>
                    )}
                    
                    {/* Data Mapping */}
                    {data?.history?.map((item) => (
                        <Box 
                            key={item._id} 
                            p='x16' 
                            mb='x8' 
                            bg='light' 
                            borderRadius='x4' 
                            display='flex' 
                            justifyContent='space-between' 
                            alignItems='center'
                        >
                            <Box>
                                <Box fontScale='p2b'>{item.roomName || t('Direct_Message')}</Box>
                                <Box fontScale='c1' color='default'>{item.messageText}</Box>
                                <Box fontScale='micro' color='hint'>
                                    {new Date(item.createdAt).toLocaleString()}
                                </Box>
                            </Box>
                            <Button 
                                square 
                                danger 
                                onClick={() => removeItemMutation.mutate(item._id)}
                                disabled={removeItemMutation.isPending}
                                title={t('Remove')}
                            >
                                <Icon name='trash' size='x20' />
                            </Button>
                        </Box>
                    ))}
                </Box>
            </PageScrollableContentWithShadow>
        </Page>
    );
};

export default AccountHistoryPage;