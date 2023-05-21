import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Image from 'next/image';
import { AuthContext } from '@/contexts/auth-context';
import { Text } from '@/components/texts/text';
import { Button } from '@/components/buttons/button';

const Page: NextPage = function Page() {
  const { goToGoogleOauthPage } = useContext(AuthContext);

  const handleGoogleLoginClick = () => {
    goToGoogleOauthPage();
  };

  return (
    <main className="relative w-screen h-screen flex justify-center items-center bg-[#1E1E1E]">
      <div className="flex flex-col items-center">
        <Text color="text-white" size="text-base">
          Welcome To
        </Text>
        <div className="mt-5">
          <Button
            text="Continue with"
            onClick={handleGoogleLoginClick}
            rightChild={<Image src="/assets/images/third-party/google.png" alt="google" width={71} height={24} />}
          />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
