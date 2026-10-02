import Forum from '@/components/forum';
import PageIntro from '@/components/page-intro';
import { chatGPTSignInPath, chatGPTSignOutPath } from '@/app/chatgpt-auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Community discussion' };
export default async function TopicPage({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; return <><PageIntro label="COMMUNITY DISCUSSION" title="Keep the conversation going.">Share your experience and build on each other’s understanding.</PageIntro><Forum topicId={id} signIn={chatGPTSignInPath('/forum/' + id)} signOut={chatGPTSignOutPath('/forum')}/></>; }
