import { Box, Throbber, Callout, States, StatesIcon, StatesTitle, StatesSubtitle } from '@rocket.chat/fuselage';
import { Page, PageHeader, PageScrollableContentWithShadow } from '@rocket.chat/ui-client';
import { useEndpoint, useTranslation, useRouter } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';
import { IMessage } from '@rocket.chat/core-typings';

import { mapMessageFromApi } from '../../../lib/utils/mapMessageFromApi';
import { onClientMessageReceived } from '../../../lib/onClientMessageReceived';
import RoomMessage from '../../../../client/components/message/variants/RoomMessage';
import { getPermaLink } from '/client/lib/getPermaLink';
const StarredMessagesPage = () => {
	const t = useTranslation();
	const getAllStarredMessages = useEndpoint('GET', '/v1/chat.getAllStarredMessages');

	const {
		data: messages,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['activity-hub', 'starred-messages'],
		queryFn: async () => {
			const allMessages: IMessage[] = [];

			let offset = 0;
			let result = await getAllStarredMessages({ offset: 0, count: 50 });

			while (result.count > 0) {
				allMessages.push(...result.messages.map(mapMessageFromApi));
				if (allMessages.length >= result.total) break;
				offset += result.count;
				result = await getAllStarredMessages({ offset, count: 50 });
			}

			// Client-side processing (dates, etc)
			return Promise.all(allMessages.map(onClientMessageReceived));
		},
		refetchOnWindowFocus: false,
	});

    const router = useRouter();
	const handleJumpToMessage = async (mid: string) => {
        try {
            const permalink = await getPermaLink(mid);
            const url = new URL(permalink);
            const relativePath = `${url.pathname}${url.search}`;
            router.navigate(relativePath as any); 

        } catch (error) {
            console.error('Error generating permalink:', error);
        }
    };

	return (
		<Page>
			<PageHeader title={t('Starred_Messages')} />
			<PageScrollableContentWithShadow>
				<Box padding='x24' maxWidth='800px' margin='0 auto' width='100%'>
					{/* <Box fontScale="h2" marginBottom="x16">{t('Starred_Messages')}</Box> */}

					{isLoading && (
						<Box display='flex' justifyContent='center' height='50vh' alignItems='center'>
							<Throbber size='x12' />
						</Box>
					)}

					{isError && (
						<Callout type='danger' title={t('Error')}>
							{t('Error_loading_starred_messages')}
						</Callout>
					)}

					{!isLoading && !isError && messages?.length === 0 && (
						<States>
							<StatesIcon name='star' />
							<StatesTitle>{t('No_starred_messages')}</StatesTitle>
							<StatesSubtitle>{t('Star_messages_to_see_them_here')}</StatesSubtitle>
						</States>
					)}

					{!isLoading && messages && messages.length > 0 && (
						<Box>
							{messages.map((msg) => (
								<Box
									key={msg._id}
									marginBlock='x16'
									padding='x16'
									borderWidth='1px'
									borderStyle='solid'
									borderColor='extra-light'
									borderRadius='x4'
									backgroundColor='surface'
									cursor='pointer'
									onClick={() => handleJumpToMessage(msg._id)}
									title={t('Jump_to_message')}
								>
									<RoomMessage message={msg} showRoomName={true} />
								</Box>
							))}
						</Box>
					)}
				</Box>
			</PageScrollableContentWithShadow>
		</Page>
	);
};

export default StarredMessagesPage;
