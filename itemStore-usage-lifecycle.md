# itemStore 사용 및 라이프사이클 문서

## 개요

`itemStore`는 Zustand를 사용한 전역 상태 관리 스토어로, 사용자가 주문하는 제품(문, 캐비닛, 하드웨어, 마감재, 부속 등)의 정보를 저장하고 관리합니다. 이 문서는 `itemStore`의 사용 패턴과 라이프사이클을 정리합니다.

## 스토어 구조

### 위치
- `src/store/itemStore.ts`

### 인터페이스
```typescript
interface ItemStore {
    item: BaseItem | null;
    setItem: (item: BaseItem) => void;
    updateItem: (updates: Partial<BaseItem>) => void;
    resetItem: () => void;
}
```

### BaseItem 타입
```typescript
export interface BaseItem {
    category: ProductType;  // DOOR, CABINET, HARDWARE, FINISH, ACCESSORY
    type: any;              // 세부 타입 (DoorType, CabinetType, HardwareType 등)
    color?: string | null;
    [key: string]: any;      // 추가 속성들을 위한 인덱스 시그니처
}
```

### 특징
- **Persist 미들웨어**: localStorage에 자동 저장 (`item-storage` 키)
- **Devtools 미들웨어**: 개발 환경에서 Redux DevTools 지원
- **File 객체 제외**: `raw_images` (File 객체)는 직렬화 시 제외됨

---

## 라이프사이클

### 1. 초기화 단계 (Initialization)

#### 1.1 카테고리 선택 페이지
사용자가 제품 카테고리를 선택하면 `setItem`으로 초기 아이템을 생성합니다.

**사용 위치:**
- `src/app/(home)/(build-material)/door/page.tsx`
- `src/app/(home)/(build-material)/cabinet/page.tsx`
- `src/app/(home)/(build-material)/hardware/page.tsx`
- `src/app/(home)/(build-material)/finish/page.tsx`
- `src/app/(home)/(build-material)/accessory/page.tsx`

**예시 (door/page.tsx):**
```typescript
const setItem = useItemStore(state => state.setItem);

onClick={() => {
    setItem({
        category: ProductType.DOOR,
        type: category.type as DoorType,
    });
    router.push(`/door/color`);
}}
```

**설정되는 필드:**
- `category`: ProductType (DOOR, CABINET, HARDWARE, FINISH, ACCESSORY)
- `type`: 세부 타입 (DoorType, CabinetType 등)

**다음 단계:** 컬러 선택 페이지로 이동

---

#### 1.2 롱문 특수 케이스
롱문은 `(preset)` 라우트 그룹에 있으며, 컬러 선택 페이지에서 초기화가 이루어집니다.

**사용 위치:**
- `src/app/(home)/(preset)/longdoor/color/page.tsx`

**예시:**
```typescript
useEffect(() => {
    // 타입 정보가 없으면 세팅
    if (!item?.category || !item?.type) {
        updateItem({
            category: ProductType.DOOR,
            type: "롱문",
        });
    }
    
    // 아직 아무 컬러도 없으면 첫번째 컬러를 기본 선택
    if (!item?.color && !item?.door_color_direct_input) {
        const defaultColor = DOOR_COLOR_LIST?.[0]?.name;
        if (defaultColor) {
            updateItem({
                color: defaultColor,
                door_color_direct_input: undefined,
            });
        }
    }
}, []);
```

---

### 2. 컬러 선택 단계 (Color Selection)

#### 2.1 컬러 선택 페이지
사용자가 색상을 선택하거나 직접 입력합니다.

**사용 위치:**
- `src/app/(home)/(build-material)/door/color/page.tsx`
- `src/app/(home)/(build-material)/cabinet/color/page.tsx`
- `src/app/(home)/(build-material)/finish/color/page.tsx`
- `src/app/(home)/(preset)/longdoor/color/page.tsx`
- 하드웨어/부속은 컬러 선택 단계가 없을 수 있음

**예시 (door/color/page.tsx):**
```typescript
const item = useItemStore(state => state.item);
const updateItem = useItemStore(state => state.updateItem);

// 색상 목록에서 선택
<ColorSelectList
    setSelectedColor={color => {
        updateItem({
            color: color,
            door_color_direct_input: undefined,
        });
    }}
/>

// 직접 입력
<ColorManualInputSheet
    onChange={color => {
        updateItem({
            door_color_direct_input: color,
            color: undefined,
        });
    }}
/>
```

**업데이트되는 필드:**
- `color`: 선택한 색상 이름 (또는 `undefined`)
- `door_color_direct_input`: 직접 입력한 색상 (또는 `undefined`)

**다음 단계:** 상세 입력 페이지로 이동

---

### 3. 상세 입력 단계 (Detail Input)

#### 3.1 타입별 상세 입력 페이지
제품 타입에 따라 다양한 필드를 입력받습니다.

**사용 위치:**

**문 (Door):**
- `src/app/(home)/(build-material)/door/(type)/standard/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/flap/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/drawer/page.tsx`
- `src/app/(home)/(preset)/longdoor/page.tsx`

**캐비닛 (Cabinet):**
- `src/app/(home)/(build-material)/cabinet/(type)/upper/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/lower/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/tall/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/open/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/flap/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/drawer/page.tsx`

**하드웨어 (Hardware):**
- `src/app/(home)/(build-material)/hardware/(type)/hinge/page.tsx`
- `src/app/(home)/(build-material)/hardware/(type)/rail/page.tsx`
- `src/app/(home)/(build-material)/hardware/(type)/piece/page.tsx`

**마감재 (Finish):**
- `src/app/(home)/(build-material)/finish/(type)/ep/page.tsx`
- `src/app/(home)/(build-material)/finish/(type)/galle/page.tsx`
- `src/app/(home)/(build-material)/finish/(type)/molding/page.tsx`

**부속 (Accessory):**
- `src/app/(home)/(build-material)/accessory/(type)/sinkbowl/page.tsx`
- `src/app/(home)/(build-material)/accessory/(type)/hood/page.tsx`
- `src/app/(home)/(build-material)/accessory/(type)/cooktop/page.tsx`

**예시 (door/standard/page.tsx):**
```typescript
const item = useItemStore(state => state.item);
const updateItem = useItemStore(state => state.updateItem);

// 초기값을 itemStore에서 읽어오기
const [door_width, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
const [door_height, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);
const [hinge, setHinge] = useState<(number | null)[]>(item?.hinge ?? []);
const [hinge_direction, setHingeDirection] = useState<HingeDirection | null>(
    (item?.hinge_direction as HingeDirection) ?? null,
);

// 값 변경 시 store에 저장
useEffect(() => {
    updateItem({ door_width });
}, [door_width]);

useEffect(() => {
    updateItem({ door_height });
}, [door_height]);

useEffect(() => {
    updateItem({ boringNum });
}, [boringNum]);
```

**업데이트되는 필드 (제품 타입별로 다름):**

**문 (Door):**
- `door_width`, `door_height`: 크기
- `boringNum`: 보링 개수 (2, 3, 4)
- `hinge`: 보링 치수 배열
- `hinge_direction`: 경첩 방향 (좌경, 우경, 모름)
- `door_location`: 용도 및 장소
- `is_pair_door`: 양문 여부 (일반문만)
- `quantity`: 문짝 개수 (롱문만)

**캐비닛 (Cabinet):**
- `width`, `height`, `depth`: 크기
- `bodyMaterial`: 몸통 재질
- `handleType`: 손잡이 타입
- `behindType`: 뒷판 타입
- `cabinet_behind_type`: 뒷판 타입 (DB 저장용)
- `cabinet_construct`: 구조 타입
- `legType`: 다리 타입

**하드웨어 (Hardware):**
- `size`: 크기
- `color`: 색상
- `request`: 요청사항

**마감재 (Finish):**
- `width`, `height`: 크기
- `color`: 색상
- `request`: 요청사항

**부속 (Accessory):**
- 타입별로 다양한 필드

**다음 단계:** 추가 정보 페이지로 이동 (있는 경우)

---

### 4. 추가 정보 단계 (Additional Information)

#### 4.1 추가 정보 입력 페이지
선택적으로 추가 정보를 입력받습니다.

**사용 위치:**
- `src/app/(home)/(build-material)/door/(type)/standard/additional/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/flap/additional/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/drawer/additional/page.tsx`
- `src/app/(home)/(preset)/longdoor/additional/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/drawer/additional/page.tsx`

**예시 (door/standard/additional/page.tsx):**
```typescript
const item = useItemStore(state => state.item);
const updateItem = useItemStore(state => state.updateItem);

const [door_request, setDoorRequest] = useState(item?.door_request ?? "");
const [addOn_hinge, setAddOn_hinge] = useState(item?.addOn_hinge ?? false);
const [door_construct, setDoorConstruct] = useState(item?.door_construct ?? false);
const [images, setImages] = useState<File[]>(item?.raw_images || []);
const [selectedThickness, setSelectedThickness] = useState<HingeThickness | null>(
    item?.hinge_thickness ?? null
);

const handleRequestChange = (newRequest: string) => {
    setDoorRequest(newRequest);
    updateItem({ door_request: newRequest });
};

const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
    updateItem({ raw_images: newImages });
};

const handleAddOnHingeChange = (newAddOnHinge: boolean) => {
    setAddOn_hinge(newAddOnHinge);
    updateItem({ addOn_hinge: newAddOnHinge });
    
    if (!newAddOnHinge) {
        setSelectedThickness(null);
        updateItem({ hinge_thickness: null });
    }
};
```

**업데이트되는 필드:**
- `door_request`: 요청사항
- `addOn_hinge`: 경첩 추가 여부
- `door_construct`: 문 구조 여부
- `raw_images`: 업로드한 이미지 파일 배열 (File 객체)
- `hinge_thickness`: 경첩 두께 (경첩 추가 시)

**다음 단계:** 리포트 페이지로 이동

---

### 5. 리포트 및 장바구니 추가 단계 (Report & Add to Cart)

#### 5.1 리포트 페이지
최종 확인 및 장바구니 추가가 이루어집니다.

**사용 위치:**
- `src/app/(home)/(build-material)/door/report/page.tsx`
- `src/app/(home)/(build-material)/cabinet/report/page.tsx`
- `src/app/(home)/(build-material)/hardware/report/page.tsx`
- `src/app/(home)/(build-material)/finish/report/page.tsx`
- `src/app/(home)/(build-material)/accessory/report/page.tsx`

**예시 (door/report/page.tsx):**
```typescript
const { item } = useItemStore();
const [quantity, setQuantity] = useState(1);
const [isLoading, setIsLoading] = useState(false);

// item이 없으면 로딩 화면
if (!item || Object.keys(item).length === 0) {
    return <div>로딩 중...</div>;
}

// item을 ShoppingCartCardNew props로 변환
<ShoppingCartCardNew
    {...transformDoorToNewCardProps(item)}
/>

// 장바구니 추가 버튼 클릭
onButton1Click={async () => {
    setIsLoading(true);
    
    // 이미지 업로드
    let doorImageUrls: string[] = [];
    if (item?.raw_images && item.raw_images.length > 0) {
        const uploadUsecase = new SupabaseUploadImageUsecase();
        doorImageUrls = await uploadUsecase.uploadImages(item.raw_images, "doors");
    }
    
    // Door 인스턴스 생성
    const door = new Door(
        item.type,
        item.color,
        item.door_width ?? 0,
        item.door_height ?? 0,
        // ... 기타 필드
    );
    
    // CartItem 생성 및 장바구니에 추가
    const cartItem = new CartItem({
        // ... CartItem 필드
    });
    
    // 장바구니에 추가
    const cartItemUsecase = new CrudCartItemUsecase();
    await cartItemUsecase.createCartItem(cartItem);
    
    // cartItemStore 업데이트
    addCartItem(cartItem);
    
    setIsLoading(false);
    router.push("/cart");
}}
```

**주요 작업:**
1. **item 읽기**: `useItemStore`에서 `item` 가져오기
2. **변환**: `transform*ToNewCardProps` 함수로 UI 표시용 props 생성
3. **이미지 업로드**: `raw_images` (File 객체)를 Supabase에 업로드하여 URL 배열로 변환
4. **도메인 모델 생성**: `item` 데이터로 `Door`, `Cabinet` 등의 인스턴스 생성
5. **CartItem 생성**: 도메인 모델과 수량으로 `CartItem` 생성
6. **장바구니 추가**: DB에 저장하고 `cartItemStore` 업데이트
7. **네비게이션**: 장바구니 페이지로 이동

**변환 함수 위치:**
- `src/utils/transformers/transformDoorToNewCardProps.ts`
- `src/utils/transformers/transformCabinetToNewCardProps.ts`
- `src/utils/transformers/transformHardwareToNewCardProps.ts`
- `src/utils/transformers/transformFinishToNewCardProps.ts`
- `src/utils/transformers/transformAccessoryToNewCardProps.ts`

---

## 주요 사용 패턴

### 1. setItem vs updateItem

#### setItem
- **용도**: 아이템을 완전히 새로 설정 (기존 데이터 덮어쓰기)
- **사용 시점**: 카테고리 선택 시 초기화
- **예시:**
```typescript
setItem({
    category: ProductType.DOOR,
    type: DoorType.STANDARD,
});
```

#### updateItem
- **용도**: 기존 아이템의 일부 필드만 업데이트
- **사용 시점**: 컬러 선택, 상세 입력, 추가 정보 입력 등
- **예시:**
```typescript
updateItem({
    color: "화이트",
    door_width: 800,
    door_height: 2000,
});
```

---

### 2. 상태 동기화 패턴

대부분의 페이지에서 로컬 state와 itemStore를 동기화합니다:

```typescript
// 1. 초기값을 itemStore에서 읽기
const [door_width, setDoorWidth] = useState<number | null>(item?.door_width ?? null);

// 2. 로컬 state 변경
const handleWidthChange = (value: number) => {
    setDoorWidth(value);
};

// 3. useEffect로 itemStore 업데이트
useEffect(() => {
    updateItem({ door_width });
}, [door_width]);
```

**이유:**
- 사용자가 뒤로가기 했을 때 입력한 값이 유지됨
- 페이지 새로고침 시에도 localStorage에서 복원됨

---

### 3. 조건부 초기화

롱문 컬러 페이지처럼 조건부로 초기화하는 경우:

```typescript
useEffect(() => {
    // 타입 정보가 없으면 세팅
    if (!item?.category || !item?.type) {
        updateItem({
            category: ProductType.DOOR,
            type: "롱문",
        });
    }
    
    // 아직 아무 컬러도 없으면 첫번째 컬러를 기본 선택
    if (!item?.color && !item?.door_color_direct_input) {
        const defaultColor = DOOR_COLOR_LIST?.[0]?.name;
        if (defaultColor) {
            updateItem({
                color: defaultColor,
                door_color_direct_input: undefined,
            });
        }
    }
}, []); // 빈 배열로 마운트 시 한 번만 실행
```

---

### 4. File 객체 처리

`raw_images`는 File 객체 배열이므로 localStorage에 저장되지 않습니다:

```typescript
// itemStore.ts의 partialize 설정
partialize: (state) => ({
    item: state.item ? {
        ...state.item,
        raw_images: undefined // File 객체 제외
    } : null
})
```

**처리 흐름:**
1. 사용자가 이미지 업로드 → `updateItem({ raw_images: File[] })`
2. 리포트 페이지에서 이미지 업로드 → Supabase에 업로드하여 URL 배열로 변환
3. URL 배열을 도메인 모델에 저장

---

## 초기화 시점

### ❌ 홈화면으로 돌아가도 초기화되지 않음

**중요:** `itemStore`는 **persist 미들웨어**를 사용하여 localStorage에 저장되므로, 홈화면으로 돌아가거나 브라우저를 닫았다가 다시 열어도 **데이터가 유지됩니다**.

**특징:**
- 홈화면(`/`)에서 `itemStore`를 초기화하는 로직이 없음
- 사용자가 주문 플로우 중간에 홈화면으로 돌아가도 입력한 정보가 그대로 유지됨
- 브라우저 새로고침(F5) 후에도 데이터가 복원됨
- 브라우저를 닫았다가 다시 열어도 데이터가 유지됨

**주의사항:**
- `raw_images` (File 객체)는 localStorage에 저장되지 않으므로, 페이지 새로고침 시 이미지가 사라질 수 있음
- **⚠️ 데이터 손실 위험**: 사용자가 다른 제품 카테고리를 선택하면 `setItem`으로 **기존 데이터가 완전히 덮어쓰기됨**

### 다른 가구 주문 시작 시 데이터 덮어쓰기

**시나리오:**
1. 가구 A를 주문하다가 (예: 문 - 일반문, 색상: 화이트, 크기: 800x2000 등)
2. 장바구니에 담지 않고
3. 다른 가구 B의 카테고리를 선택 (예: 캐비닛 - 상부장)

**결과:**
```typescript
// itemStore.ts의 setItem 구현
setItem: (item: BaseItem) => set({ item }),

// 카테고리 선택 시 호출
setItem({
    category: ProductType.CABINET,
    type: CabinetType.UPPER,
});
```

**동작:**
- 기존 가구 A의 **모든 데이터가 완전히 사라짐** (색상, 크기, 기타 필드 등)
- 가구 B의 `category`와 `type`만 있는 새로운 item으로 교체됨
- 가구 A의 입력했던 정보는 복구 불가능

**예시:**
```typescript
// 이전 상태 (가구 A - 문)
item = {
    category: ProductType.DOOR,
    type: DoorType.STANDARD,
    color: "화이트",
    door_width: 800,
    door_height: 2000,
    hinge: [100, 200],
    // ... 기타 필드
}

// 가구 B (캐비닛) 카테고리 선택 후
setItem({
    category: ProductType.CABINET,
    type: CabinetType.UPPER,
});

// 결과
item = {
    category: ProductType.CABINET,
    type: CabinetType.UPPER,
    // 이전 데이터는 모두 사라짐
}
```

**권장 개선사항:**
- 사용자가 다른 카테고리를 선택할 때 경고 메시지 표시
- 또는 기존 데이터를 백업하고 복구 옵션 제공
- 또는 `setItem` 호출 전에 기존 데이터 확인 및 사용자 확인 요청

### 장바구니 추가 후 초기화

**모든 리포트 페이지에서 장바구니에 담은 후 `itemStore`를 초기화합니다.**

**사용 위치:**
- `src/app/(home)/(build-material)/door/report/page.tsx` (223번째 줄)
- `src/app/(home)/(build-material)/cabinet/report/page.tsx` (486번째 줄)
- `src/app/(home)/(build-material)/hardware/report/page.tsx` (247번째 줄)
- `src/app/(home)/(build-material)/finish/report/page.tsx` (216번째 줄)
- `src/app/(home)/(build-material)/accessory/report/page.tsx` (176번째 줄)

**예시 (door/report/page.tsx):**
```typescript
onButton1Click={async () => {
    // ... 장바구니 추가 로직 ...
    
    // item 상태 초기화
    useItemStore.setState({ item: undefined });
    router.replace("/cart");
}}
```

**초기화 시점:**
1. 장바구니에 성공적으로 추가된 후
2. 장바구니 페이지로 이동하기 직전
3. 모든 리포트 페이지에서 동일한 패턴 사용

**주의사항:**
- `resetItem()` 메서드를 사용하지 않고 직접 `useItemStore.setState({ item: undefined })`를 호출
- 일관성을 위해 `resetItem()`을 사용하는 것을 권장하지만, 현재는 직접 `setState` 사용

### resetItem 메서드

`resetItem`은 스토어에 정의되어 있지만, 현재 코드베이스에서 실제로 호출되는 곳은 없습니다.

**정의:**
```typescript
resetItem: () => set({ item: null }),
```

**현재 사용 방식:**
- 리포트 페이지에서 `useItemStore.setState({ item: undefined })` 직접 호출
- `resetItem()` 대신 직접 `setState` 사용

**권장 개선사항:**
- 모든 리포트 페이지에서 `resetItem()` 메서드를 사용하도록 통일
- 코드 일관성 및 유지보수성 향상

---

## 제품 타입별 플로우 요약

### 문 (Door)
1. `/door` → 카테고리 선택 → `setItem({ category, type })`
2. `/door/color` → 색상 선택 → `updateItem({ color })`
3. `/door/{type}` → 상세 입력 → `updateItem({ door_width, door_height, hinge, ... })`
4. `/door/{type}/additional` → 추가 정보 → `updateItem({ door_request, raw_images, ... })`
5. `/door/report` → 리포트 및 장바구니 추가

### 롱문 (Longdoor)
1. `/longdoor/color` → 색상 선택 (자동 초기화) → `updateItem({ category, type, color })`
2. `/longdoor` → 상세 입력 → `updateItem({ door_width, door_height, quantity, ... })`
3. `/longdoor/additional` → 추가 정보 → `updateItem({ door_request, raw_images, ... })`
4. `/door/report` → 리포트 및 장바구니 추가

### 캐비닛 (Cabinet)
1. `/cabinet` → 카테고리 선택 → `setItem({ category, type })`
2. `/cabinet/color` → 색상 선택 → `updateItem({ color })`
3. `/cabinet/{type}` → 상세 입력 → `updateItem({ width, height, depth, ... })`
4. `/cabinet/{type}/additional` (일부 타입만) → 추가 정보
5. `/cabinet/report` → 리포트 및 장바구니 추가

### 하드웨어 (Hardware)
1. `/hardware` → 카테고리 선택 → `setItem({ category, type })`
2. `/hardware/{type}` → 상세 입력 → `updateItem({ size, color, request })`
3. `/hardware/report` → 리포트 및 장바구니 추가

### 마감재 (Finish)
1. `/finish` → 카테고리 선택 → `setItem({ category, type })`
2. `/finish/color` → 색상 선택 → `updateItem({ color })`
3. `/finish/{type}` → 상세 입력 → `updateItem({ width, height, request })`
4. `/finish/report` → 리포트 및 장바구니 추가

### 부속 (Accessory)
1. `/accessory` → 카테고리 선택 → `setItem({ category, type })`
2. `/accessory/{type}` → 상세 입력 → `updateItem({ ... })`
3. `/accessory/report` → 리포트 및 장바구니 추가

---

## 주의사항

### 1. 타입 안정성
- `BaseItem`의 `[key: string]: any` 인덱스 시그니처로 인해 타입 안정성이 떨어짐
- 각 제품 타입별로 인터페이스를 정의하는 것을 권장

### 2. File 객체 처리
- `raw_images`는 localStorage에 저장되지 않음
- 리포트 페이지에서 반드시 업로드 처리 필요
- 페이지 새로고침 시 이미지가 사라질 수 있음

### 3. 상태 동기화
- 로컬 state와 itemStore를 항상 동기화해야 함
- `useEffect`의 의존성 배열을 올바르게 설정해야 함

### 4. 초기값 처리
- `item`이 `null`이거나 빈 객체일 수 있음
- 리포트 페이지에서 반드시 null 체크 필요

---

## 관련 파일 목록

### 스토어
- `src/store/itemStore.ts` - itemStore 정의

### 카테고리 선택 페이지
- `src/app/(home)/(build-material)/door/page.tsx`
- `src/app/(home)/(build-material)/cabinet/page.tsx`
- `src/app/(home)/(build-material)/hardware/page.tsx`
- `src/app/(home)/(build-material)/finish/page.tsx`
- `src/app/(home)/(build-material)/accessory/page.tsx`

### 컬러 선택 페이지
- `src/app/(home)/(build-material)/door/color/page.tsx`
- `src/app/(home)/(build-material)/cabinet/color/page.tsx`
- `src/app/(home)/(build-material)/finish/color/page.tsx`
- `src/app/(home)/(preset)/longdoor/color/page.tsx`

### 상세 입력 페이지 (일부)
- `src/app/(home)/(build-material)/door/(type)/standard/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/flap/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/drawer/page.tsx`
- `src/app/(home)/(preset)/longdoor/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/upper/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/lower/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/tall/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/open/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/flap/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/drawer/page.tsx`
- `src/app/(home)/(build-material)/hardware/(type)/hinge/page.tsx`
- `src/app/(home)/(build-material)/hardware/(type)/rail/page.tsx`
- `src/app/(home)/(build-material)/hardware/(type)/piece/page.tsx`
- `src/app/(home)/(build-material)/finish/(type)/ep/page.tsx`
- `src/app/(home)/(build-material)/finish/(type)/galle/page.tsx`
- `src/app/(home)/(build-material)/finish/(type)/molding/page.tsx`
- `src/app/(home)/(build-material)/accessory/(type)/sinkbowl/page.tsx`
- `src/app/(home)/(build-material)/accessory/(type)/hood/page.tsx`
- `src/app/(home)/(build-material)/accessory/(type)/cooktop/page.tsx`

### 추가 정보 페이지
- `src/app/(home)/(build-material)/door/(type)/standard/additional/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/flap/additional/page.tsx`
- `src/app/(home)/(build-material)/door/(type)/drawer/additional/page.tsx`
- `src/app/(home)/(preset)/longdoor/additional/page.tsx`
- `src/app/(home)/(build-material)/cabinet/(type)/drawer/additional/page.tsx`

### 리포트 페이지
- `src/app/(home)/(build-material)/door/report/page.tsx`
- `src/app/(home)/(build-material)/cabinet/report/page.tsx`
- `src/app/(home)/(build-material)/hardware/report/page.tsx`
- `src/app/(home)/(build-material)/finish/report/page.tsx`
- `src/app/(home)/(build-material)/accessory/report/page.tsx`

### 변환 함수
- `src/utils/transformers/transformDoorToNewCardProps.ts`
- `src/utils/transformers/transformCabinetToNewCardProps.ts`
- `src/utils/transformers/transformHardwareToNewCardProps.ts`
- `src/utils/transformers/transformFinishToNewCardProps.ts`
- `src/utils/transformers/transformAccessoryToNewCardProps.ts`

---

## 업데이트 이력

- 2024-XX-XX: 초기 문서 작성
