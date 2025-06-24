## 목차

- [목차](#목차)
- [사용자 인증 (Auth)](#사용자-인증-auth)
- [사용자 관리 (User)](#사용자-관리-user)
- [전문가 (Expert)](#전문가-expert)
- [결제 (Payment)](#결제-payment)
- [북마크 (Bookmark)](#북마크-bookmark)
- [상담 (Consultation)](#상담-consultation)
  - [예약 (Reservation)](#예약-reservation)
  - [검색 (Search)](#검색-search)

## 사용자 인증 (Auth)

| Method | Endpoint                            | 설명                 | 요청 헤더    |
| ------ | ----------------------------------- | -------------------- | ------------ |
| POST   | /api/v1/auth/login                  | 일반 로그인          | -            |
| POST   | /api/v1/auth/logout                 | 로그아웃             | Bearer Token |
| POST   | /api/v1/auth/kakao                  | 카카오 로그인        | -            |
| POST   | /api/v1/auth/google                 | 구글 로그인          | -            |
| POST   | /api/v1/auth/naver                  | 네이버 로그인        | -            |
| POST   | /api/v1/auth/find-id                | 아이디 찾기          | -            |
| POST   | /api/v1/auth/password-reset/request | 비밀번호 재설정 요청 | -            |
| POST   | /api/v1/auth/password-reset/verify  | 재설정 인증번호 확인 | -            |
| GET    | /api/v1/auth/check-email            | 이메일 중복 확인     | -            |

## 사용자 관리 (User)

| Method | Endpoint               | 설명                  | 요청 헤더    |
| ------ | ---------------------- | --------------------- | ------------ |
| POST   | /api/v1/users          | 회원가입              | -            |
| GET    | /api/v1/users/me       | 현재 사용자 정보 조회 | Bearer Token |
| PUT    | /api/v1/users/{id}     | 사용자 정보 수정      | Bearer Token |
| DELETE | /api/v1/users/withdraw | 회원 탈퇴             | Bearer Token |
| PUT    | /api/v1/users/password | 비밀번호 변경         | Bearer Token |

## 전문가 (Expert)

| Method | Endpoint                | 설명                    | 요청 헤더 |
| ------ | ----------------------- | ----------------------- | --------- |
| GET    | /api/v1/experts         | 전문가 목록 조회        | -         |
| GET    | /api/v1/experts/{id}    | 전문가 상세 정보 조회   | -         |
| GET    | /api/v1/experts/monthly | 이달의 전문가 목록 조회 | -         |

## 결제 (Payment)

| Method | Endpoint                     | 설명           | 요청 헤더    |
| ------ | ---------------------------- | -------------- | ------------ |
| POST   | /api/v1/payments/prepare     | 결제 준비      | Bearer Token |
| GET    | /api/v1/payments             | 결제 내역 조회 | Bearer Token |
| GET    | /api/v1/payments/{id}/status | 결제 상태 조회 | Bearer Token |
| DELETE | /api/v1/payments/{id}        | 결제 취소      | Bearer Token |

## 북마크 (Bookmark)

| Method | Endpoint                            | 설명             | 요청 헤더    |
| ------ | ----------------------------------- | ---------------- | ------------ |
| GET    | /api/v1/bookmarks                   | 북마크 목록 조회 | Bearer Token |
| POST   | /api/v1/bookmarks/toggle/{expertId} | 북마크 토글      | Bearer Token |

## 상담 (Consultation)

| Method | Endpoint                                   | 설명             | 요청 헤더    |
| ------ | ------------------------------------------ | ---------------- | ------------ |
| GET    | /api/v1/consultation/rooms                 | 상담 내역 조회   | Bearer Token |
| GET    | /api/v1/consultation/rooms/{roomId}/detail | 상담 상세 조회   | Bearer Token |
| POST   | /api/v1/consultation/rooms                 | 상담방 생성      | Bearer Token |
| PATCH  | /api/v1/consultation/rooms/{roomId}/read   | 메시지 읽음 처리 | Bearer Token |

### 예약 (Reservation)

| Method | Endpoint                  | 설명           | 요청 헤더    |
| ------ | ------------------------- | -------------- | ------------ |
| GET    | /api/v1/reservations      | 예약 목록 조회 | Bearer Token |
| POST   | /api/v1/reservations      | 예약 생성      | Bearer Token |
| GET    | /api/v1/reservations/{id} | 예약 상세 조회 | Bearer Token |
| DELETE | /api/v1/reservations/{id} | 예약 취소      | Bearer Token |

### 검색 (Search)

| Method | Endpoint                   | 설명        | 요청 헤더 |
| ------ | -------------------------- | ----------- | --------- |
| GET    | /api/v1/search             | 통합 검색   | -         |
| GET    | /api/v1/search/suggestions | 검색어 추천 | -         |
