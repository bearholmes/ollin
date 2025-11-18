# Ollin 배포 가이드 (Deployment Guide)

**버전**: 0.6.0 **최종 업데이트**: 2025-11-18

---

## 📋 목차

1. [배포 준비](#배포-준비)
2. [Chrome Web Store 배포](#chrome-web-store-배포)
3. [GitHub Release 자동 배포](#github-release-자동-배포)
4. [GitHub Pages 배포](#github-pages-배포)
5. [버전 관리](#버전-관리)
6. [배포 체크리스트](#배포-체크리스트)

---

## 🚀 배포 준비

### 1. 빌드 테스트

배포 전에 반드시 로컬에서 빌드를 테스트하세요:

```bash
# 전체 테스트 실행
npm test

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 빌드 실행
npm run build

# 빌드 결과 확인
ls -la dist/chrome/
ls -la dist/bookmarklet/
```

### 2. 버전 업데이트

배포할 버전을 결정하고 다음 파일들을 업데이트하세요:

**package.json**:

```json
{
  "version": "0.7.0"
}
```

**app/manifest.json**:

```json
{
  "version": "0.7.0"
}
```

### 3. CHANGELOG 작성 (권장)

주요 변경사항을 기록하세요:

```markdown
## [0.7.0] - 2025-11-XX

### Added

- 새로운 기능 추가

### Changed

- 변경된 기능

### Fixed

- 버그 수정
```

---

## 🌐 Chrome Web Store 배포

### 수동 배포 프로세스

#### 1. Extension 빌드

```bash
npm run build:chrome
cd dist/chrome
zip -r ../../ollin-chrome-extension.zip .
cd ../..
```

#### 2. Chrome Web Store에 업로드

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   접속
2. 기존 Extension 선택 (또는 새로 생성)
3. **"Upload new package"** 클릭
4. `ollin-chrome-extension.zip` 업로드
5. Store listing 정보 업데이트:
   - 설명 (Description)
   - 스크린샷 (Screenshots)
   - 카테고리 (Category)
6. **"Submit for review"** 클릭

#### 3. 검토 대기

- 일반적으로 1-3일 소요
- 검토 상태는 Dashboard에서 확인 가능
- 승인 후 자동으로 배포됨

### 자동 배포 (향후 추가 가능)

Chrome Web Store API를 사용한 자동 배포는 현재 미구현 상태입니다. 추후 GitHub
Actions 워크플로우에 추가 가능합니다.

---

## 🏷️ GitHub Release 자동 배포

### 버전 태그로 자동 릴리스

Ollin은 **Git 태그를 푸시하면 자동으로 GitHub Release가 생성**됩니다.

#### 1. 버전 업데이트 및 커밋

```bash
# 1. 버전 업데이트 (package.json, manifest.json)
npm version patch  # 0.6.0 → 0.6.1 (버그 수정)
# 또는
npm version minor  # 0.6.0 → 0.7.0 (기능 추가)
# 또는
npm version major  # 0.6.0 → 1.0.0 (큰 변경)

# 2. manifest.json 버전도 수동으로 업데이트
# (package.json과 동일하게 맞춤)

# 3. 변경사항 커밋
git add .
git commit -m "chore: Bump version to 0.7.0"
```

#### 2. 태그 생성 및 푸시

```bash
# 버전 태그 생성 (v 접두사 필수!)
git tag v0.7.0

# 태그 푸시 (이 순간 자동 배포 시작!)
git push origin v0.7.0

# 또는 모든 태그 푸시
git push --tags
```

#### 3. 자동 배포 프로세스

태그를 푸시하면 `.github/workflows/release.yml`이 자동으로:

1. ✅ 테스트 실행
2. ✅ Chrome Extension 빌드
3. ✅ Bookmarklet 빌드
4. ✅ ZIP 파일 생성
5. ✅ GitHub Release 생성
6. ✅ Artifact 첨부
7. ✅ Release Notes 자동 생성

#### 4. Release 확인

1. GitHub 저장소의 **Releases** 탭 확인
2. `v0.7.0` 릴리스가 자동 생성됨
3. 다운로드 가능한 ZIP 파일 확인:
   - `ollin-chrome-extension.zip`
   - `ollin-bookmarklet.zip`

### 태그 명명 규칙

**반드시 `v` 접두사 사용!**

✅ **올바른 예시**:

- `v0.6.0`
- `v0.6.1`
- `v0.7.0`
- `v1.0.0`
- `v1.0.0-beta.1`
- `v2.1.3-rc.1`

❌ **잘못된 예시**:

- `0.6.0` (v 없음)
- `ver0.6.0`
- `version-0.6.0`

### 태그 삭제 (실수한 경우)

```bash
# 로컬 태그 삭제
git tag -d v0.7.0

# 원격 태그 삭제
git push origin :refs/tags/v0.7.0
```

---

## 📄 GitHub Pages 배포

### 자동 배포

`main` 또는 `master` 브랜치에 푸시하면 자동으로 GitHub Pages가 배포됩니다.

```bash
# main 브랜치에 푸시
git push origin main
```

`.github/workflows/deploy-pages.yml`이 자동으로:

1. Bookmarklet 빌드
2. docs/ 폴더 복사
3. GitHub Pages에 배포

### 수동 배포 트리거

GitHub Actions 탭에서 수동으로 실행 가능:

1. GitHub 저장소 → **Actions** 탭
2. **Deploy GitHub Pages** 워크플로우 선택
3. **Run workflow** 클릭
4. 브랜치 선택 후 실행

### 배포 URL

배포 완료 후 다음 URL에서 확인:

```
https://bearholmes.github.io/ollin/
```

---

## 📌 버전 관리

### Semantic Versioning

Ollin은 [Semantic Versioning (SemVer)](https://semver.org/)을 따릅니다:

```
MAJOR.MINOR.PATCH

예: 0.6.0
    │ │ │
    │ │ └─ PATCH: 버그 수정
    │ └─── MINOR: 기능 추가 (하위 호환)
    └───── MAJOR: 큰 변경 (하위 비호환)
```

### 버전 올리기

```bash
# PATCH: 0.6.0 → 0.6.1 (버그 수정)
npm version patch

# MINOR: 0.6.0 → 0.7.0 (기능 추가)
npm version minor

# MAJOR: 0.6.0 → 1.0.0 (큰 변경)
npm version major

# Pre-release: 0.7.0 → 0.7.0-beta.0
npm version prerelease --preid=beta
```

**주의**: `npm version` 명령은 `package.json`만 업데이트하므로,
`app/manifest.json`도 수동으로 동일한 버전으로 업데이트해야 합니다!

### 버전 일관성 확인

```bash
# package.json 버전 확인
cat package.json | grep version

# manifest.json 버전 확인
cat app/manifest.json | grep version
```

---

## ✅ 배포 체크리스트

### 배포 전 체크리스트

- [ ] 모든 테스트 통과 (`npm test`)
- [ ] ESLint 통과 (`npm run lint`)
- [ ] TypeScript 타입 체크 통과 (`npm run type-check`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] `package.json` 버전 업데이트
- [ ] `app/manifest.json` 버전 업데이트 (package.json과 동일)
- [ ] 변경사항 커밋
- [ ] CHANGELOG.md 업데이트 (권장)

### GitHub Release 배포

- [ ] 버전 태그 생성 (`git tag v0.x.x`)
- [ ] 태그 푸시 (`git push origin v0.x.x`)
- [ ] GitHub Actions 워크플로우 성공 확인
- [ ] Release 페이지에서 ZIP 파일 확인
- [ ] Release Notes 검토 및 수정 (필요시)

### Chrome Web Store 배포

- [ ] `dist/chrome/` 빌드 확인
- [ ] ZIP 파일 생성
- [ ] Chrome Web Store Developer Dashboard 업로드
- [ ] Store listing 정보 업데이트
- [ ] 스크린샷 업데이트 (필요시)
- [ ] Submit for review
- [ ] 검토 승인 대기
- [ ] 배포 완료 확인

### GitHub Pages 배포

- [ ] `main` 브랜치 푸시
- [ ] GitHub Actions 워크플로우 성공 확인
- [ ] 배포 URL 접속 확인 (https://bearholmes.github.io/ollin/)
- [ ] Bookmarklet 작동 테스트

---

## 🔧 트러블슈팅

### GitHub Actions 워크플로우 실패

**증상**: 태그 푸시 후 Release가 생성되지 않음

**해결방법**:

1. GitHub Actions 탭에서 로그 확인
2. 테스트 실패 → 로컬에서 `npm test` 실행 후 수정
3. 빌드 실패 → `npm run build` 확인
4. 태그 삭제 후 재생성

### 버전 불일치

**증상**: `package.json`과 `manifest.json` 버전이 다름

**해결방법**:

```bash
# 현재 버전 확인
cat package.json | grep '"version"'
cat app/manifest.json | grep '"version"'

# manifest.json 수동 업데이트
# (package.json과 동일하게)
```

### ZIP 파일 손상

**증상**: Chrome Web Store 업로드 시 에러

**해결방법**:

```bash
# 빌드 디렉토리에서 ZIP 생성 (심볼릭 링크 제외)
cd dist/chrome
zip -r ../../ollin-chrome-extension.zip . -x "*.DS_Store" -x "__MACOSX"
cd ../..
```

---

## 📚 참고 자료

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Creating Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)

---

## 🆘 도움말

배포 중 문제가 발생하면:

1. **GitHub Issues**: https://github.com/bearholmes/ollin/issues
2. **Documentation**: 프로젝트 루트의 `CODE_REVIEW_FINAL.md` 참조
3. **CI/CD 로그**: GitHub Actions 탭에서 상세 로그 확인

---

**작성일**: 2025-11-18 **검토자**: AI Code Review System **버전**: 1.0.0
