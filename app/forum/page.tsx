import PageIntro from '@/components/page-intro';
import Forum from '@/components/forum';
import { chatGPTSignInPath, chatGPTSignOutPath } from '@/app/chatgpt-auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Community forum' };
export default function ForumPage() { return <><PageIntro label="THE E-CALLISTO COMMUNITY" title="A shared sky. An open conversation.">Ask questions, exchange methods, and help each other make sense of solar radio observations.</PageIntro><Forum signIn={chatGPTSignInPath('/forum')} signOut={chatGPTSignOutPath('/forum')}/></>; }
