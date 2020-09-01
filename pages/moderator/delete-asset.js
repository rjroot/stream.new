import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Button from '../../components/button';
import FullpageSpinner from '../../components/fullpage-spinner';

export default function Asset () {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { asset_id: assetId, slack_moderator_password: slackModeratorPassword } = router.query;

  const deleteAsset = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slack_moderator_password: slackModeratorPassword,
        }),
      });
      if (!resp.ok) {
        setErrorMessage(`Error deleting asset: ${resp.status}`);
        return;
      }
      setIsLoading(false);
      setIsDeleted(true);
    } catch (e) {
      console.error('Error deleting asset', e); // eslint-disable-line no-console
      setErrorMessage('Error deleting asset');
    }
  };

  if (errorMessage) {
    return (
      <Layout>
        <div><h1>{errorMessage}</h1></div>
      </Layout>
    );
  }

  return (
    <Layout>
      {
        isLoading
          ? <FullpageSpinner />
          : (
            <div className="wrapper">
              { isDeleted ? <div>Asset {assetId} is deleted</div> : <Button onClick={deleteAsset}>Delete asset {assetId}</Button> }
              <style jsx>{`
            .wrapper {
              flex-grow: 1;
              display: flex;
              align-items: center;
            }
          `}
              </style>
            </div>
          )
      }
    </Layout>
  );
}