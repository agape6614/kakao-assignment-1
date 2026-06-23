export default function TodosLoading() {
  return (
    <div style={styles.container}>
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner} className="loading-spinner"></div>
        <p style={styles.text}>할 일 목록을 불러오는 중...</p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  loaderWrapper: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #672be0', borderRadius: '50%' },
  text: { fontSize: '15px', fontWeight: '600', color: '#672be0', margin: 0, letterSpacing: '-0.3px' },
};