# 백엔드 API 통합 가이드

## 개요
프론트엔드는 라우팅과 API 서비스 레이어를 통해 백엔드와 연결되도록 구성되었습니다.

## 구조

### 1. API 서비스 레이어 (`src/services/api.js`)
- 모든 백엔드 API 요청을 중앙화하여 관리
- 공통 요청/응답 처리
- 에러 핸들링

### 2. 페이지 컴포넌트
- `src/pages/Home.jsx` - 홈화면 (Live Cam + DataGrid)
- `src/pages/PreviousRecords.jsx` - 이전 기록 조회 페이지

### 3. 라우팅 설정
- `/` - 홈 페이지
- `/records` - 이전 기록 조회
- `/graph` - 그래프 페이지 (개발 중)

## 백엔드 API 엔드포인트 명시

### 필수 구현 엔드포인트

#### 1. Live Cam API
```
GET /api/live-cam
응답: { imageUrl, timestamp }

GET /api/live-cam/stats
응답: { time, frameDrops }
```

#### 2. Records API
```
GET /api/records?date=YYYY-MM-DD&search=query&page=1&limit=14
응답: { records: [...], total, page, limit }

GET /api/records/date/:date
응답: { records: [...] }

GET /api/records/search?q=query
응답: { records: [...] }

GET /api/records/:id
응답: { record: {...} }

POST /api/records
요청: { title, description, location, date, ... }
응답: { record: {...} }

PUT /api/records/:id
요청: { title, description, location, ... }
응답: { record: {...} }

DELETE /api/records/:id
응답: { success: true }
```

## 환경 설정

### .env 파일 설정
```
# 개발 환경
VITE_API_URL=http://localhost:3000/api

# 프로덕션
VITE_API_URL=https://api.embegeo.com/api
```

## API 사용 예시

### 페이지에서 API 호출
```javascript
import { recordsAPI, liveCamAPI } from '../services/api'

// 기록 조회
const data = await recordsAPI.getRecords({
  date: '2026-04-10',
  search: 'keyword',
  page: 1,
  limit: 14
})

// 라이브 카메라 데이터
const camData = await liveCamAPI.getData()
const stats = await liveCamAPI.getStats()
```

## PreviousRecords 페이지 통합

현재 `src/pages/PreviousRecords.jsx`는 다음 기능을 구현하고 있습니다:

1. **기록 조회** - API를 통해 기록 데이터 조회
2. **날짜 필터** - 선택한 날짜의 기록만 표시
3. **검색** - 키워드로 기록 검색
4. **페이지네이션** - 14개씩 표시 (필요시 확장)
5. **새로고침** - 데이터 새로 조회

### 수정 포인트
API 응답 구조에 맞게 `recordsAPI.getRecords()` 호출 부분을 수정하세요.

```javascript
// 현재 코드: api.js의 메서드 사용
const data = await recordsAPI.getRecords({ date, limit: 100 })

// 필요시 API 응답 포맷 맞추기
setRecords(data.records || Array(14).fill(null))
```

## CORS 설정 주의사항

백엔드에서 프론트엔드의 요청을 받을 때 CORS 설정이 필요합니다:

```
Access-Control-Allow-Origin: http://localhost:5173 (개발)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 에러 핸들링

API 요청 실패 시:
- 콘솔에 에러 로그가 기록됩니다
- 사용자에게 에러 메시지가 표시됩니다
- 개발 중에는 더미 데이터가 표시됩니다

## 다음 단계

1. 백엔드에서 위의 엔드포인트 구현
2. `.env` 파일에서 `VITE_API_URL` 업데이트
3. 각 페이지에서 실제 API 호출 테스트
4. 에러 핸들링 및 로딩 상태 개선
5. 캐싱 및 최적화 (필요시)
