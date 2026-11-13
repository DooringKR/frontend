/**
 * 동작 목록(2026-11-13) — 구 바로가구에서 사람이 하는·보는 동작을 분류마다 모은 것. 바로키친 어드민 lib/design/behaviors.ts 와 같은 틀·같은 id.
 * 목표: 두 곳 이상에서 일어나는 동작은 한 컴포넌트가 맡고, 화면은 그 컴포넌트로만 그 동작을 한다.
 * 한 화면에만 있는 동작은 화면 코드로 둔다(single — 두 번째가 생기면 컴포넌트로 뺀다).
 *
 * comp = 컴포넌트를 쓴 곳을 세는 정규식, raw = 화면에서 직접 짠 곳을 세는 정규식.
 * 셈: npm run behaviors → behavior-coverage.json → /dev/behaviors. 견본은 /dev/design(data-behavior 가 이 id).
 * 정규식은 코드 모양에 맞춘 근사치다 — 직접 짠 곳 목록(rawWhere)으로 확인하고, 모양이 바뀌면 여기를 고친다.
 * 조사: 2026-11-13 전수 조사(1362자리·직접 짠 곳 562).
 */
export interface Rule {
  comp?: string;
  raw?: string;
  /** 이 레포에선 한 화면뿐 — 직접 짠 곳을 빚으로 세지 않는다 */
  single?: string;
}

export interface Behavior {
  id: string;
  category: string;
  name: string;
  /** 맡은 컴포넌트(없으면 「없음」) */
  component: string;
  /** 이 동작의 규칙 한 줄 */
  rule: string;
  /** 견본(/dev/design) 칸 id — 없으면 견본 없음 */
  spec?: string;
  count?: Rule;
}

const R = String.raw;

/** 컴포넌트 자기 파일 — 그 동작을 맡는 자리라 안쪽 코드는 직접 짠 곳으로 세지 않는다 */
export const PART_FILES = [
  R`src/components/(ui|form|overlay|state|nav|media)/`,
  R`src/components/(Progress|QuantitySelector|SelectableOptionCard|TopNavigator|Header)/`,
  R`src/components/Card/ImageCard\.tsx`,
  R`src/lib/(nav/go|use-copy)\.ts`,
  R`src/app/dev/`,
  // 업무 컴포넌트를 ui 위에 다시 짠 것 — 안쪽은 그 컴포넌트의 자리
  R`src/components/(PaymentNoticeCard|DeliveryTimeCheck|BottomNavigation)/`,
  R`src/app/customer-service/components/contactStatusChip`,
];

export const BEHAVIORS: Behavior[] = [
  // ── 불러오기·저장
  {
    id: "load",
    category: "불러오기·저장",
    name: "불러오는 중 표시",
    component: "Loading · ListSkeleton",
    rule: "읽기 전엔 Loading(page·inline)·ListSkeleton, 안 읽힌 것과 빈 것을 가른다",
    spec: "load",
    count: { comp: R`<(Loading|ListSkeleton)\b`, raw: R`["'>]\s*(로딩 ?중|불러오는 ?중\.\.\.|계산 중\.\.\.)|animate-pulse` },
  },
  {
    id: "action",
    category: "불러오기·저장",
    name: "누르는 일(연타 막기·도는 표시·실패 알림)",
    component: "useAction · Button busy · ActionError",
    rule: "도는 동안 막고 도는 표시, 실패는 누른 자리 옆, 버튼 글을 「처리 중…」으로 바꾸지 않는다",
    spec: "action",
    count: { comp: R`useAction\(`, raw: R`(처리|요청|접수|주문) ?(중|하는 중)\.\.\.` },
  },
  // ── 입력
  {
    id: "field",
    category: "입력",
    name: "칸 이름·필수 표시·빈 칸 알림",
    component: "Field · useRequired",
    rule: "버튼은 늘 눌리고, 누르면 첫 빈 칸으로 가서 그 밑에 알림(범위 오류도 누를 때)",
    spec: "field",
    count: { comp: R`useRequired\(`, raw: R`button1Disabled|nextDisabled|text-orange-500 ml-1">\*|disabled=\{!(isFormValid|isValid|ready|canProceed)` },
  },
  {
    id: "text",
    category: "입력",
    name: "글자 칸 · 여러 줄",
    component: "Input · Textarea",
    rule: "50px 상자 하나, 이름·오류는 Field 가",
    spec: "text",
    count: { comp: R`<(Input|Textarea)\b`, raw: R`BoxedInput|UnderlinedInput|<input(?![^>]*type=["'](file|hidden|checkbox|radio)["'])|<textarea\b` },
  },
  {
    id: "number",
    category: "입력",
    name: "숫자·치수 칸",
    component: "NumberInput",
    rule: "단위(mm·개)를 칸 안 오른쪽에 늘, 숫자만 받는다",
    spec: "number",
    count: { comp: R`<NumberInput\b`, raw: R`type=["']number["']|BoringInputField` },
  },
  {
    id: "phone",
    category: "입력",
    name: "전화번호 칸",
    component: "PhoneInput",
    rule: "숫자만 받고 010-0000-0000 모양으로",
    spec: "phone",
    count: { comp: R`<PhoneInput\b`, raw: R`type=["']tel["']` },
  },
  {
    id: "address",
    category: "입력",
    name: "주소 검색",
    component: "AddressField",
    rule: "Daum 우편번호로 고른다, 스크립트 전엔 칸에 「불러오는 중」",
    spec: "address",
    count: { comp: R`<AddressField\b`, raw: R`daum\.Postcode|DaumPostcode` },
  },
  {
    id: "datetime",
    category: "입력",
    name: "날짜·시각 칸",
    component: "DateField · TimeField",
    rule: "기기 기본 칸 대신 같은 달력·시각 휠을 시트로",
    spec: "datetime",
    count: { comp: R`<(DateField|TimeField)\b`, raw: R`type=["']date["']|DatePicker\b|TimePicker` },
  },
  {
    id: "choose",
    category: "입력",
    name: "값 고르기(하나·여러 개)",
    component: "Choose",
    rule: "모양은 컴포넌트가 정한다 — 짧은 선택지는 칸, 설명·그림이 있으면 카드, 9개 이상은 시트",
    spec: "choose",
    count: { comp: R`<Choose\b`, raw: R`BoxedSelect|SelectToggleButton|BrandInverse|SegmentedControl|ImageButton|ChoiceCard` },
  },
  {
    id: "checkbox",
    category: "입력",
    name: "체크박스",
    component: "Checkbox · SelectableOptionCard",
    rule: "이름은 체크 옆 한 줄, 이름을 눌러도 켜진다",
    spec: "checkbox",
    count: { comp: R`<(Checkbox|SelectableOptionCard)\b`, raw: R`type=["']checkbox["']|components/Checkbox["']` },
  },
  {
    id: "toggle",
    category: "입력",
    name: "켜기·끄기",
    component: "Switch",
    rule: "줄 오른쪽 스위치 하나",
    spec: "checkbox",
    count: { comp: R`<Switch\b`, raw: R`components/Switches` },
  },
  {
    id: "quantity",
    category: "입력",
    name: "수량 바꾸기",
    component: "QuantitySelector",
    rule: "− 수 + 한 줄, 1에서 −는 빼기(확인받고)",
    spec: "quantity",
    count: { comp: R`<QuantitySelector\b`, raw: R`aria-label="수량 (감소|증가)"` },
  },
  // ── 고르기·목록
  {
    id: "accordion",
    category: "고르기·목록",
    name: "접기·펼치기",
    component: "Collapsible",
    rule: "머리 줄을 눌러 펼치고 접는다",
    spec: "accordion",
    count: { comp: R`<Collapsible\b`, raw: R`setIs(Expanded|Open)\(!|(?<!Select)ToggleButton` },
  },
  {
    id: "truncate",
    category: "고르기·목록",
    name: "더 보기·쪽 나누기",
    component: "없음(주문 내역 한 화면)",
    rule: "말없이 자르지 않는다",
    count: { single: "주문 내역뿐" },
  },
  {
    id: "pagechips",
    category: "고르기·목록",
    name: "배너 넘겨 보기",
    component: "없음(홈 배너 한 곳)",
    rule: "자동 넘김 + 점 표시",
    count: { single: "홈 배너뿐" },
  },
  // ── 알림·창
  {
    id: "toast",
    category: "알림·창",
    name: "토스트(잠깐 뜨는 결과)",
    component: "toast(sonner)",
    rule: "성공만 토스트, 실패는 누른 자리 옆, alert 금지",
    spec: "toast",
    count: { comp: R`toast\.(success|info|message)\(`, raw: R`\balert\(` },
  },
  {
    id: "actionerror",
    category: "알림·창",
    name: "동작 오류(누른 자리 옆)",
    component: "ActionError",
    rule: "버튼 바로 위·줄 바로 밑, role=alert",
    spec: "action",
    count: { comp: R`<ActionError\b`, raw: R`\balert\(` },
  },
  {
    id: "pageerror",
    category: "알림·창",
    name: "화면 오류(읽기 실패)",
    component: "ErrorBanner",
    rule: "빨간 띠 하나 + 다시 읽기",
    spec: "load",
    count: { comp: R`<ErrorBanner\b` },
  },
  {
    id: "notice",
    category: "알림·창",
    name: "안내·경고 상자",
    component: "Notice",
    rule: "회색 안내·파랑 알림·빨강 경고 세 모양",
    spec: "notice",
    count: { comp: R`<(Notice|PaymentNoticeCard)\b`, raw: R`bg-(yellow|orange|amber)-50` },
  },
  {
    id: "statuslabel",
    category: "알림·창",
    name: "상태 띠",
    component: "Badge",
    rule: "색 5가지 × 세기 2가지, 상태 글자·색은 표 하나에서",
    spec: "statuslabel",
    count: { comp: R`<(Badge|DeliveryStatusChip|ContactStatusChip)\b`, raw: R`components/Chip` },
  },
  {
    id: "empty",
    category: "알림·창",
    name: "빈 목록 안내",
    component: "EmptyState",
    rule: "가운데 한 줄 + 할 일 버튼 하나",
    spec: "load",
    count: { comp: R`<EmptyState\b` },
  },
  {
    id: "confirm",
    category: "알림·창",
    name: "되돌릴 수 없는 일 전 확인",
    component: "ConfirmSheet · useConfirm",
    rule: "시트로 한 번 묻고, 실패는 시트 안, 큰 일은 글자를 쳐야 눌림",
    spec: "sheet",
    count: { comp: R`<ConfirmSheet\b|useConfirm\(`, raw: R`window\.confirm|WithdrawModal|WithdrawConfirmModal|AddressChangeConfirm` },
  },
  {
    id: "sheet",
    category: "알림·창",
    name: "바텀시트",
    component: "Sheet(shadcn Drawer)",
    rule: "아래에서 올라오는 판 하나, 끌거나 바깥 누르면 닫힘, 겹쳐 띄우기는 확인뿐",
    spec: "sheet",
    count: { comp: R`<Sheet\b`, raw: R`components/BottomSheet|components/Modal|fixed inset-0` },
  },
  {
    id: "viewer",
    category: "파일·사진",
    name: "사진 크게 보기",
    component: "PhotoThumbs · PhotoViewer(shadcn Dialog)",
    rule: "검은 바탕 한 장, ‹ › 넘기기, 닫기",
    spec: "viewer",
    count: { comp: R`<(PhotoViewer|ImageCard|PhotoThumbs)\b`, raw: R`bg-opacity-75|bg-black/(75|80|90)` },
  },
  {
    id: "fileupload",
    category: "파일·사진",
    name: "사진 고르기",
    component: "PhotoPick",
    rule: "점선 상자 + 고른 사진 칸, 넘친 것은 알린다",
    spec: "fileupload",
    count: { comp: R`<PhotoPick\b`, raw: R`ImageUploadInput|type=["']file["']` },
  },
  // ── 이동
  {
    id: "button",
    category: "이동",
    name: "버튼",
    component: "Button(shadcn)",
    rule: "변형 7·크기 4, 색·둥글기를 그 자리에서 덮지 않는다",
    spec: "button",
    count: { comp: R`<Button\b`, raw: R`<button\b` },
  },
  {
    id: "bottombar",
    category: "이동",
    name: "아래 고정 버튼 칸",
    component: "BottomBar",
    rule: "늘 fixed, 위로 흰 그러데이션, 버튼 1~2개 + 왼쪽 글",
    spec: "bottombar",
    count: { comp: R`<BottomBar\b`, raw: R`BottomButton|<div[^>]*fixed bottom-0[^>]*>\s*<(Button|button)` },
  },
  {
    id: "back",
    category: "이동",
    name: "뒤로가기",
    component: "TopNavigator · goBack",
    rule: "앞 화면이 없으면(새 탭) 정해 둔 곳으로 — 앱 밖으로 나가지 않는다",
    count: { comp: R`goBack\(|goAfterSave\(|<TopNavigator\b`, raw: R`router\.back\(\)` },
  },
  {
    id: "redirect",
    category: "이동",
    name: "동작 뒤 화면 옮기기",
    component: "goAfterSubmit · goAfterSave",
    rule: "주문·접수 뒤는 replace, 하위 입력 저장 뒤는 갈 곳을 정해 돌아간다",
    count: { comp: R`goAfter(Submit|Save)\(` },
  },
  {
    id: "navrow",
    category: "이동",
    name: "눌러서 이동하는 줄·카드",
    component: "NavRow · NavTiles(큰 그림 타일)",
    rule: "줄 오른쪽 ›, div onClick 금지(키보드로도 눌림)",
    spec: "navrow",
    count: { comp: R`<(NavRow|NavTiles)\b`, raw: R`<div[^>]*onClick=\{\(\) => router\.(push|replace)` },
  },
  {
    id: "tel",
    category: "이동",
    name: "전화 걸기",
    component: "tel 링크(Button asChild)",
    rule: "href=\"tel:\" 하나, window.open 금지",
    spec: "copy",
    count: { comp: R`href=\{?["'\x60]tel:`, raw: R`window\.open\(["'\x60]tel:` },
  },
  {
    id: "progress",
    category: "이동",
    name: "단계 진행 막대",
    component: "ProgressBar(shadcn Progress)",
    rule: "위 바 바로 밑, 20 단위",
    spec: "progress",
    count: { comp: R`<ProgressBar\b` },
  },
  // ── 공유
  {
    id: "copy",
    category: "공유",
    name: "복사",
    component: "useCopy",
    rule: "누른 버튼만 「복사됨」+토스트, 막히면 글을 보여 준다",
    spec: "copy",
    count: { comp: R`useCopy\(`, raw: R`navigator\.clipboard` },
  },
  // ── 업무 고유(컴포넌트가 아닌 업무 흐름 — 화면 코드로 둔다)
  {
    id: "preview",
    category: "업무 고유",
    name: "치수 반영 미리보기 그림",
    component: "DoorPreview 3종(업무 그림)",
    rule: "그림 계산은 업무 코드 — 이번 통일 범위 밖",
    count: { single: "문 그림 전용" },
  },
  {
    id: "price",
    category: "업무 고유",
    name: "가격·합계 표시",
    component: "PriceSummaryCard · OrderSummaryCard",
    rule: "「별도 견적」「부터~」 판단은 업무 규칙 — 이번 통일 범위 밖",
    count: { single: "가격 계산 업무" },
  },
];
