# 배포 작업 일지

## 🚀 배포 목표
Next.js 프로젝트(`nextjs-admin-divisions` 서브디렉토리)를 GitHub에 푸시하고 Netlify에 성공적으로 배포하는 것이 목표였습니다.

## 🚧 발생한 문제점 및 해결 과정

### 1. Git 저장소 문제
*   **문제:** 초기 Git 푸시 시 `node_modules` 디렉토리가 포함되어 GitHub의 파일 크기 제한(100MB)을 초과하여 푸시가 실패했습니다.
*   **해결:**
    *   `git reset` 및 `git rm -r --cached .` 명령으로 스테이징된 파일을 초기화했습니다.
    *   `.gitignore` 파일에 `/nextjs-admin-divisions/node_modules` 및 `/nextjs-admin-divisions/.next`를 추가하여 불필요한 파일들이 Git에 포함되지 않도록 했습니다.
    *   변경 사항을 다시 커밋하고 푸시했습니다.

### 2. Netlify 빌드 설정 오류
*   **문제:** Netlify가 `package.json`을 찾지 못하거나 빌드 명령을 실행하지 못했습니다.
*   **해결:**
    *   Netlify 빌드 설정에서 **Base directory**를 `nextjs-admin-divisions`로, **Build command**를 `npm run build`로, **Publish directory**를 `.next`로 정확히 설정하도록 안내했습니다.

### 3. NextAuth 타입 오류 (지속적인 문제)
*   **문제:** `next-auth` 콜백(특히 `jwt` 및 `session`)의 타입 정의가 Next.js 빌드 환경에서 `AuthOptions` 타입과 호환되지 않아 빌드가 계속 실패했습니다. "Type 'JWT' has no properties in common with type 'JWT'"와 같은 복잡한 타입 충돌 메시지가 반복되었습니다.
*   **해결:**
    *   `lib/auth.ts` 파일에서 `export const authOptions`의 `export` 키워드를 제거하여 `route.ts` 파일의 타입 오류를 해결했습니다.
    *   `next-auth` 및 `next` 버전 간의 호환성 문제로 판단하여, `package.json`에서 `next-auth`를 `4.21.1`로, `next`를 `^13.5.6`으로, `react`, `react-dom`, `@types/react`를 `^18.2.0`으로 다운그레이드했습니다.
    *   `node_modules`와 `package-lock.json`을 완전히 삭제 후 `npm install`을 다시 실행했습니다.
    *   `next-auth.d.ts` 파일을 생성하여 `Session` 및 `JWT` 타입에 `role` 속성을 확장했습니다.
    *   `lib/auth.ts` 파일의 `jwt` 콜백 및 `session` 콜백의 매개변수 타입을 `next-auth`의 `AuthOptions` 시그니처에 정확히 맞추고, `AdapterUser` import 경로를 `next-auth/adapters`에서 `next-auth/core/types`로 변경했습니다. (이후 `AdapterUser` import를 다시 `next-auth/adapters`로 변경하고, 최종적으로 `next-auth`에서 `AdapterUser`를 직접 import하는 방식으로 수정했습니다.)
    *   최종적으로 `session` 콜백의 매개변수 타입을 `next-auth`의 `AuthOptions` 시그니처에 정확히 맞추고, `DefaultSession` 및 `AdapterUser`를 `next-auth`에서 가져오도록 수정했습니다.

### 4. Supabase 환경 변수 오류
*   **문제:** `Invalid supabaseUrl` 오류가 발생하여 Supabase URL이 올바르게 설정되지 않았음을 나타냈습니다.
*   **해결:**
    *   Netlify 대시보드의 **Site settings > Build & deploy > Environment** 섹션에서 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 포함한 모든 환경 변수(`NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`)를 정확히 설정하도록 안내했습니다.
    *   환경 변수 설정 위치를 찾기 어려워하는 사용자님을 위해 Netlify UI의 특정 버튼과 메뉴 이름을 명확히 안내했습니다.

### 5. `supabase` 참조 오류 (회원가입 기능 추가 후)
*   **문제:** 이메일 회원가입 및 로그인 기능을 구현한 후 Netlify에 배포했을 때, `lib/auth.ts` 파일에서 `supabase`와 `bcrypt`를 찾을 수 없다는 타입 에러(`Cannot find name 'supabase'`)가 발생하며 빌드가 실패했습니다.
*   **해결:**
    *   `lib/auth.ts` 파일 상단에 `supabase` 클라이언트와 `bcrypt` 라이브러리를 import하는 구문을 추가하여 문제를 해결했습니다.
    ```typescript
    import { supabase } from './supabase';
    import bcrypt from 'bcrypt';
    ```

## ✅ 최종 상태
모든 코드 수정 및 Netlify 설정 변경 후, 프로젝트가 성공적으로 빌드되고 배포되었습니다.

## 💡 중요 권고사항
*   **보안:** `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 채팅에 노출되었으므로, **반드시 Supabase 대시보드에서 키를 교체(rotate)하고 Netlify 환경 변수를 새로운 키로 업데이트해야 합니다.**
*   **`NEXTAUTH_SECRET`:** 이 값은 애플리케이션 보안에 매우 중요하므로, **길고 복잡한 무작위 문자열**로 설정해야 합니다.
*   **환경 변수 관리:** 민감한 정보는 `.env.local`에만 두지 말고, 배포 환경(Netlify)의 환경 변수 설정에 직접 입력해야 합니다.

## 🌐 배포 정보

이 프로젝트는 Netlify를 통해 배포되었습니다.

*   **GitHub Repository:** [https://github.com/bodu1197/toko](https://github.com/bodu1197/toko)
*   **배포된 웹사이트:** [https://papaya-bienenstitch-cb96ef.netlify.app/](https://papaya-bienenstitch-cb96ef.netlify.app/)

## 🛠️ 기술 스택

이 프로젝트는 다음 기술을 활용합니다:

*   **데이터베이스 및 인증:** [Supabase](https://supabase.com/)

## 🚀 배포 방법 (Deployment)

이 프로젝트는 Netlify를 통해 `master` 브랜치에서 자동 배포됩니다. 로컬에서 변경한 내용을 웹사이트에 반영하려면 다음 단계를 따르세요.

1.  **변경사항 커밋 (Commit Changes):**
    작업한 내용을 의미 있는 메시지와 함께 커밋합니다.
    ```bash
    git add .
    git commit -m "feat: 새로운 기능 추가"
    ```

2.  **원격 저장소로 푸시 (Push to Remote):**
    `master` 브랜치로 변경사항을 푸시하면 자동으로 배포가 시작됩니다.
    ```bash
    git push origin master
    ```

3.  **배포 확인 (Verify Deployment):**
    푸시 후에는 [Netlify 대시보드](https://app.netlify.com/projects/papaya-bienenstitch-cb96ef/overview)에서 배포 과정을 확인할 수 있습니다.
