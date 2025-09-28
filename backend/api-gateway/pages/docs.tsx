import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/swagger',
      permanent: false,
    },
  };
};

export default function DocsRedirect() {
  return null;
}
