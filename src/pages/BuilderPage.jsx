import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import RequirementsLoader from '../components/requirements/RequirementsLoader.jsx';
import FileDropzone from '../components/uploads/FileDropzone.jsx';
import ProgressBar from '../components/status/ProgressBar.jsx';
import GenerateButton from '../components/generate/GenerateButton.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import { useRequirementsStore } from '../store/useRequirementsStore.js';
import { useUploadsStore } from '../store/useUploadsStore.js';

export default function BuilderPage() {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const clearReqs = useRequirementsStore((s) => s.clear);
  const clearUploads = useUploadsStore((s) => s.clear);

  function resetAll() {
    clearReqs();
    clearUploads();
    setConfirming(false);
  }

  return (
    <>
      <Header onReset={() => setConfirming(true)} />
      <main className="main">
        <RequirementsLoader />
        <FileDropzone />
        <div className="bottom-bar">
          <ProgressBar />
          <GenerateButton />
        </div>
      </main>
      <Footer />
      <ConfirmModal
        open={confirming}
        message={t('common.confirmReset')}
        onConfirm={resetAll}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
