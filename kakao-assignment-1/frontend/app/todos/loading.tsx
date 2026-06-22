export default function TodosLoading() {
  return (
    <div style={styles.container}>
      <div style={styles.loaderWrapper}>
        {/* CSS 애니메이션이 적용될 스피너 요소 */}
        <div style={styles.spinner} className="loading-spinner"></div>
        <p style={styles.text}>할 일 목록을 불러오는 중...</p>
      </div>

      {/* 인라인 스타일로 keyframes 애니메이션을 주입하기 위한 style 태그 */}
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

// ---------------------------------------------------------
// 미니멀 & 메인 컬러(#672be0) 기반 로딩 화면 스타일 정의
// ---------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh', // 화면의 중앙 부근에 오도록 설정
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loaderWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3', // 밝은 회색 테두리 (배경 역할)
    borderTop: '4px solid #672be0', // 지정된 브랜드 메인 컬러 포인트
    borderRadius: '50%',
  },
  text: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#672be0', // 지정된 브랜드 메인 컬러
    margin: 0,
    letterSpacing: '-0.3px',
  },
};