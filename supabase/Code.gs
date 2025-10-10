/**
 * Google Apps Script (Estimate Sheet Generator)
 * Updated to align with dooring-core-domain enum usage & numeric ID payloads.
 * Backward compatible with previous payload version.
 *
 * Accepted inputs now:
 * - door_type / cabinet_type / etc may be string enum keys (STANDARD, LOWER, ...) or numeric IDs.
 * - accessory_type / hardware_type may be uppercase domain keys (SINK, COOKTOP, HOOD, HINGE, RAIL, PIECE)
 *   or previous lowercase values (cooktop, hood, sinkbowl, hinge, rail, bolt).
 * - color fields may be comma-joined string OR array of hierarchical names.
 *
 * To finalize numeric ID mapping, adjust the *_ID_MAP constants below if actual IDs differ.
 */

// --- Mapping Configuration (EDIT IF YOUR NUMERIC IDS DIFFER) ------------------
var DOOR_TYPE_ID_MAP = {
  1: 'STANDARD',
  2: 'FLAP',
  3: 'DRAWER',
  4: 'DIRECT_INPUT' // direct input sentinel
};

var CABINET_TYPE_ID_MAP = {
  1: 'LOWER',
  2: 'UPPER',
  3: 'DRAWER',
  4: 'OPEN',
  5: 'FLAP',
  6: 'DIRECT_INPUT'
};

// Some body material / accessory / hardware direct-input sentinel key
var DIRECT_INPUT_KEY = 'DIRECT_INPUT';

// Accessory & Hardware display text previously derived by code logic
// We normalize upstream values to these canonical script keys.
var ACCESSORY_CANONICAL_MAP = {
  // domain key -> canonical internal key (we keep prior lower-case for continuity)
  'SINK': 'sinkbowl',
  'COOKTOP': 'cooktop',
  'HOOD': 'hood',
  // backward compatibility (already canonical)
  'sinkbowl': 'sinkbowl',
  'cooktop': 'cooktop',
  'hood': 'hood'
};

var HARDWARE_CANONICAL_MAP = {
  'HINGE': 'hinge',
  'RAIL': 'rail',
  'PIECE': 'bolt', // PIECE maps to bolt label used in legacy sheet
  // backward compatibility
  'hinge': 'hinge',
  'rail': 'rail',
  'bolt': 'bolt'
};

// --- Normalization Helpers ----------------------------------------------------
function normalizeTypeViaMap(value, idMap) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return idMap[value] || '';
  return String(value);
}

function resolveDoorType(rawType, directInput) {
  var t = normalizeTypeViaMap(rawType, DOOR_TYPE_ID_MAP);
  if (t === 'DIRECT_INPUT') {
    return { key: 'DIRECT_INPUT', display: '(직접 입력) ' + (directInput || '') };
  }
  return { key: t, display: getDoorType(t) || t };
}

function resolveCabinetType(rawType, directInput) {
  var t = normalizeTypeViaMap(rawType, CABINET_TYPE_ID_MAP);
  if (t === 'DIRECT_INPUT') {
    return { key: 'DIRECT_INPUT', display: '(직접 입력) ' + (directInput || '') };
  }
  return { key: t, display: getCabinetType(t) || t };
}

function canonicalAccessoryType(raw) {
  if (!raw && raw !== 0) return '';
  var key = String(raw).toUpperCase();
  // domain keys are uppercase; map to canonical
  if (ACCESSORY_CANONICAL_MAP[key]) return ACCESSORY_CANONICAL_MAP[key];
  // maybe raw already lower-case canonical
  if (ACCESSORY_CANONICAL_MAP[raw]) return ACCESSORY_CANONICAL_MAP[raw];
  return raw; // fallback
}

function canonicalHardwareType(raw) {
  if (!raw && raw !== 0) return '';
  var key = String(raw).toUpperCase();
  if (HARDWARE_CANONICAL_MAP[key]) return HARDWARE_CANONICAL_MAP[key];
  if (HARDWARE_CANONICAL_MAP[raw]) return HARDWARE_CANONICAL_MAP[raw];
  return raw;
}

function ensureColorString(raw) {
  if (raw == null) return '';
  if (Array.isArray(raw)) return raw.join(', ');
  return String(raw);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  // Normalize order_items to array to avoid runtime errors
  var orderItems = Array.isArray(data.order_items) ? data.order_items : [];

  // 날짜 포맷 변환
  var dateObj = new Date(data.created_at);
  var formattedDate = Utilities.formatDate(dateObj, 'Asia/Seoul', 'yyyyMMdd_HHmm');
  var fileName = 'receipt_' + data.recipient_phone + '_' + formattedDate;
  var ss = SpreadsheetApp.create(fileName);

  var sheet = ss.getActiveSheet();
  sheet.setName('receipt');

  // B2~C3 병합
  sheet.getRange('B2:C3').merge();
  // D2~I2 병합
  sheet.getRange('D2:I2').merge();
  // D3~I3 병합 (텍스트: 견적서)
  sheet.getRange('D3:I3').merge();
  sheet.getRange('D3').setValue('견적서');
  sheet.getRange('D3').setFontSize(16);
  // 주소 입력은 아래 delivery_type 기반 블록에서 처리합니다.

  // 날짜 포맷 변환
  var dateObj = new Date(data.created_at);
  var days = ['일', '월', '화', '수', '목', '금', '토'];
  var formatted = Utilities.formatDate(dateObj, 'Asia/Seoul', 'yyyy년 MM월 dd일') +
    ' (' + days[dateObj.getDay()] + ') ' +
    Utilities.formatDate(dateObj, 'Asia/Seoul', 'HH:mm:ss');
  sheet.getRange('D2').setValue('작성일 : ' + formatted);

  // B5~C5 병합 및 텍스트 입력
  sheet.getRange('B5:C5').merge();
  sheet.getRange('B5').setValue('배송 방법');
  // D5~E5 병합 및 값 입력 (배송/픽업)
  sheet.getRange('D5:E5').merge();
  var deliveryTypeText = '';
    // 判定은 delivery_type (DELIVERY / PICK_UP)
    if (String(data.delivery_type).toUpperCase() === 'DELIVERY') {
      deliveryTypeText = '배송';
    } else if (String(data.delivery_type).toUpperCase() === 'PICK_UP') {
      deliveryTypeText = '픽업';
    } else {
      // fallback: 과거 로직 유지
      deliveryTypeText = (data.order_options && data.order_options.delivery) ? '배송' : '픽업';
    }
  sheet.getRange('D5').setValue(deliveryTypeText);
  // F5~G5 병합 및 텍스트 입력
  sheet.getRange('F5:G5').merge();
  sheet.getRange('F5').setValue('받는 분 휴대폰 번호');

  // H5~I5 병합 및 값 입력 (전화번호 포맷팅)
  sheet.getRange('H5:I5').merge();
  sheet.getRange('H5').setNumberFormat('@STRING@');
  var phone = String(data.recipient_phone);
  if (phone.length === 10) {
    phone = '0' + phone;
  }
  if (phone.length === 11) {
    phone = phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
  sheet.getRange('H5').setValue(phone);

  // D6~I6 병합 (주소 입력)
  sheet.getRange('D6:I6').merge();
  var address = '';
  if (String(data.delivery_type).toUpperCase() === 'DELIVERY') {
    if (data.address1 || data.address2) {
      address = (data.address1 || '') + ' / ' + (data.address2 || '');
    } else if (data.order_options && data.order_options.delivery) {
      address = (data.order_options.delivery.recipient_road_address || '') + ' / ' +
                (data.order_options.delivery.recipient_detail_address || '');
    }
  } else {
    address = '경기도 남양주시 오남읍 양지로 139번길 11-14';
  }
  sheet.getRange('D6').setValue(address);

  // B6~C6 병합 및 텍스트 입력
  sheet.getRange('B6:C6').merge();
  var addrLabel = (String(data.delivery_type).toUpperCase() === 'DELIVERY') ? '배송 주소' : '픽업 주소(공장)';
  sheet.getRange('B6').setValue(addrLabel);

  // B8~B9 병합 후 '구분' 입력
  sheet.getRange('B8:B9').merge();
  sheet.getRange('B8').setValue('구분');

  // C8~E9 병합 후 '품목' 입력
  sheet.getRange('C8:E9').merge();
  sheet.getRange('C8').setValue('품목');

  // F8~F9 병합 후 '개수' 입력
  sheet.getRange('F8:F9').merge();
  sheet.getRange('F8').setValue('개수');

  // G8~H8 병합 후 '단가 (단위: 원)' 입력
  sheet.getRange('G8:H8').merge();
  sheet.getRange('G8').setValue('단가 (단위: 원)');

  // I8~I9 병합 후 '비고' 입력
  sheet.getRange('I8:I9').merge();
  sheet.getRange('I8').setValue('비고');

  // G9 '개당' 입력
  sheet.getRange('G9').setValue('개당');

  // H9 '합계' 입력
  sheet.getRange('H9').setValue('합계');

  // order_items 에서 DOOR 만 필터링
  var doorItems = orderItems.filter(function(item) {
    return normalizeProductType(item.product_type) === 'DOOR';
  });

  // DOOR 아이템 개수
  var doorCount = doorItems.length;
  Logger.log('doorCount:', doorCount);
  var doorStartRow = 10;

  if (doorCount > 0) {
    // B열 병합
    sheet.getRange('B' + doorStartRow + ':B' + (doorStartRow + 2 * doorCount - 1)).merge();
    sheet.getRange('B' + doorStartRow).setValue('가구 도어');

    // DOOR 아이템 데이터 C열부터 채우기
    for (var i = 0; i < doorCount; i++) {
      addDoorItem(sheet, doorStartRow + 2 * i, 3, doorItems[i]);
    }
  }

  var finishItems = orderItems.filter(function(item) {
    return normalizeProductType(item.product_type) === 'FINISH';
  });
  var finishCount = finishItems.length;
  // DOOR 영역 끝 다음 행 계산
  var finishStartRow = doorStartRow + 2 * doorCount;

  // FINISH 아이템이 있을 때만 함수 호출
  if (finishCount > 0) {
    sheet.getRange('B' + finishStartRow + ':B' + (finishStartRow + finishCount - 1)).merge();
    sheet.getRange('B' + finishStartRow).setValue('가구 마감재');    
    for (var i = 0; i < finishCount; i++) {
      addFinishItem(sheet, finishStartRow + i, 3, finishItems[i]); // 3은 C열
    }
  }

  // CABINET 아이템 필터링 및 함수 호출
  var cabinetItems = orderItems.filter(function(item) {
    return normalizeProductType(item.product_type) === 'CABINET';
  });
  var cabinetCount = cabinetItems.length;
  var cabinetStartRow = finishStartRow + finishCount; // 마감재가 끝난 다음 행

  if (cabinetCount > 0) {
    // B열 병합: cabinetStartRow부터 2 * cabinetCount 행까지 병합
    sheet.getRange('B' + cabinetStartRow + ':B' + (cabinetStartRow + 2 * cabinetCount - 1)).merge();
    sheet.getRange('B' + cabinetStartRow).setValue('부분장');

    // CABINET 아이템 행 추가
    for (var i = 0; i < cabinetCount; i++) {
      addCabinetItem(sheet, cabinetStartRow + 2 * i, 3, cabinetItems[i]); // 3은 C열
    }
  }

  // ACCESSORY
  var accessoryItems = orderItems.filter(function(item) {
    return normalizeProductType(item.product_type) === 'ACCESSORY';
  });
  var accessoryCount = accessoryItems.length;
  var accessoryStartRow = cabinetStartRow + 2 * cabinetCount; // 부분장 끝 다음 행

  if (accessoryCount > 0) {
    sheet.getRange('B' + accessoryStartRow + ':B' + (accessoryStartRow + accessoryCount - 1)).merge();
    sheet.getRange('B' + accessoryStartRow).setValue('가구 부속');
    for (var i = 0; i < accessoryCount; i++) {
      addAccessoryItem(sheet, accessoryStartRow + i, 3, accessoryItems[i]);
    }
  }

  // HARDWARE
  var hardwareItems = orderItems.filter(function(item) {
    return normalizeProductType(item.product_type) === 'HARDWARE';
  });
  var hardwareCount = hardwareItems.length;
  var hardwareStartRow = accessoryStartRow + accessoryCount; // 부속 끝 다음 행

  if (hardwareCount > 0) {
    sheet.getRange('B' + hardwareStartRow + ':B' + (hardwareStartRow + hardwareCount - 1)).merge();
    sheet.getRange('B' + hardwareStartRow).setValue('가구 하드웨어');
    for (var i = 0; i < hardwareCount; i++) {
      addHardwareItem(sheet, hardwareStartRow + i, 3, hardwareItems[i]);
    }
  }
  // 하드웨어 마지막 행 계산
  var lastHardwareRow = hardwareStartRow + hardwareCount - 1;

  // 소계 행: B~G 병합, H에 합계
  var subtotalRow = lastHardwareRow + 1;
  sheet.getRange(subtotalRow, 2, 1, 6).merge(); // B~G
  sheet.getRange(subtotalRow, 2).setValue('소계');


  // 소계: H열(8번째 열)
  sheet.getRange(subtotalRow, 8).setFormula('=SUM(H' + doorStartRow + ':H' + lastHardwareRow + ')');

  // 배송비 행: B~G 병합, H에 30,000
  var deliveryRow = subtotalRow + 1;
  sheet.getRange(deliveryRow, 2, 1, 6).merge();
  sheet.getRange(deliveryRow, 2).setValue('배송비');
  if (String(data.delivery_type).toUpperCase() === 'DELIVERY') {
    sheet.getRange(deliveryRow, 8).setValue(30000);
  } else {
    sheet.getRange(deliveryRow, 8).setValue(0);
  }

  // 총계 행: B~G 병합, H에 총계(소계+배송비)
  var totalRow = deliveryRow + 2;
  sheet.getRange(totalRow, 2, 1, 6).merge();
  sheet.getRange(totalRow, 2).setValue('총계');
  // 총계: H열(8번째 열)
  sheet.getRange(totalRow, 8).setFormula('=SUM(H' + subtotalRow + ':H' + (totalRow - 1) + ')');

  // 계좌/전화번호 안내 행: B~E 병합, F~I 병합
  var infoRow = totalRow + 2;
  sheet.getRange(infoRow, 2, 1, 4).merge();
  sheet.getRange(infoRow, 2).setValue('도어링 계좌번호');
  sheet.getRange(infoRow, 6, 1, 4).merge();
  sheet.getRange(infoRow, 6).setValue('고객센터 전화번호');

  // 계좌/전화번호 값 행: B~E 병합, F~I 병합
  var valueRow = infoRow + 1;
  sheet.getRange(valueRow, 2, 2, 4).merge();
  sheet.getRange(valueRow, 2).setValue('IBK 기업은행 52307836904011');
  sheet.getRange(valueRow, 6, 1, 4).merge();
  sheet.getRange(valueRow, 6).setValue('010-6409-4542');

  // 안내 행: F~I 병합
  var noticeRow = valueRow + 1;
  sheet.getRange(noticeRow, 6, 1, 4).merge();
  sheet.getRange(noticeRow, 6).setValue('평일, 토요일 : 09~18시 바로 연결 / 일요일, 공휴일 : 연결 느릴 수 있음');

  // 예시 적용
  setBorder(sheet, 'B2:I3');
  setBorder(sheet, 'B5:I6');
  setBorder(sheet, 'B8:I9');

  // 도어 영역 (예: B12:I(12+2*doorCount-1))
  if (doorCount > 0) {
    setBorder(sheet, 'B' + doorStartRow + ':I' + (doorStartRow + 2 * doorCount - 1));
  }

  // 마감재 영역
  if (finishCount > 0) {
    setBorder(sheet, 'B' + finishStartRow + ':I' + (finishStartRow + finishCount - 1));
  }

  // 부분장 영역
  if (cabinetCount > 0) {
    setBorder(sheet, 'B' + cabinetStartRow + ':I' + (cabinetStartRow + 2 * cabinetCount - 1));
  }

  // 부속 영역
  if (accessoryCount > 0) {
    setBorder(sheet, 'B' + accessoryStartRow + ':I' + (accessoryStartRow + accessoryCount - 1));
  }

  // 하드웨어 영역
  if (hardwareCount > 0) {
    setBorder(sheet, 'B' + hardwareStartRow + ':I' + (hardwareStartRow + hardwareCount - 1));
  }

  // 소계+배송비 영역 (예: B(subtotalRow):I(deliveryRow))
  setBorder(sheet, 'B' + subtotalRow + ':I' + deliveryRow);

  // 총계 영역
  setBorder(sheet, 'B' + totalRow + ':I' + totalRow);

  // 도어링 계좌번호 영역 (B~E, infoRow ~ infoRow+1)
  setBorder(sheet, 'B' + infoRow + ':E' + (infoRow + 2));

  // 고객센터 전화번호 영역 (F~I, infoRow ~ infoRow+2)
  setBorder(sheet, 'F' + infoRow + ':I' + (infoRow + 2));

  // 굵게 표시할 셀들
  sheet.getRange('D3').setFontWeight('bold'); // '견적서'
  sheet.getRange('B5').setFontWeight('bold'); // '배송 방법'
  sheet.getRange('F5').setFontWeight('bold'); // '받는 분 휴대폰 번호'
  sheet.getRange('B6').setFontWeight('bold'); // '배송 주소'/'픽업 주소(공장)'
  sheet.getRange('B8').setFontWeight('bold'); // '구분'
  sheet.getRange('C8').setFontWeight('bold'); // '품목'
  sheet.getRange('F8').setFontWeight('bold'); // '개수'
  sheet.getRange('G8').setFontWeight('bold'); // '단가 (단위: 원)'
  sheet.getRange('I8').setFontWeight('bold'); // '비고'
  sheet.getRange('G9').setFontWeight('bold'); // '개당'
  sheet.getRange('H9').setFontWeight('bold'); // '합계'

  // 도어 색상 셀 굵게 (예: 도어 영역의 두 번째 행 C~E)
  for (var i = 0; i < doorCount; i++) {
    sheet.getRange(doorStartRow + 2 * i + 1, 3, 1, 3).setFontWeight('bold');
  }

  // 부분장 색상 셀 굵게 (예: 부분장 영역의 두 번째 행 C~E)
  for (var i = 0; i < cabinetCount; i++) {
    sheet.getRange(cabinetStartRow + 2 * i + 1, 3, 1, 3).setFontWeight('bold');
  }

  // 각 item의 합계 셀 굵게 (H열, DOOR/FINISH/CABINET/ACCESSORY/HARDWARE)
  doorItems.forEach(function(item, idx) {
    sheet.getRange(doorStartRow + 2 * idx, 8, 2, 1).setFontWeight('bold');
  });
  finishItems.forEach(function(item, idx) {
    sheet.getRange(finishStartRow + idx, 8).setFontWeight('bold');
  });
  cabinetItems.forEach(function(item, idx) {
    sheet.getRange(cabinetStartRow + 2 * idx, 8, 2, 1).setFontWeight('bold');
  });
  accessoryItems.forEach(function(item, idx) {
    sheet.getRange(accessoryStartRow + idx, 8).setFontWeight('bold');
  });
  hardwareItems.forEach(function(item, idx) {
    sheet.getRange(hardwareStartRow + idx, 8).setFontWeight('bold');
  });

  if (doorCount > 0) sheet.getRange('B' + doorStartRow).setFontWeight('bold');
  if (finishCount > 0) sheet.getRange('B' + finishStartRow).setFontWeight('bold');
  if (cabinetCount > 0) sheet.getRange('B' + cabinetStartRow).setFontWeight('bold');
  if (accessoryCount > 0) sheet.getRange('B' + accessoryStartRow).setFontWeight('bold');
  if (hardwareCount > 0) sheet.getRange('B' + hardwareStartRow).setFontWeight('bold');
  // '소계'와 '총계' 텍스트 크기 12로
  sheet.getRange(subtotalRow, 2).setFontSize(12);
  sheet.getRange(totalRow, 2).setFontSize(12);

  // 도어 색상 셀 배경색 (#fdf2f8)
  for (var i = 0; i < doorCount; i++) {
    sheet.getRange(doorStartRow + 2 * i + 1, 3, 1, 3).setBackground('#fdf2f8');
  }

  // 부분장 색상 셀 배경색 (#fdf2f8)
  for (var i = 0; i < cabinetCount; i++) {
    sheet.getRange(cabinetStartRow + 2 * i + 1, 3, 1, 3).setBackground('#fdf2f8');
  }

  // 소계 및 총계 행의 B~I열 배경색 (연한 주황색 3: #ffe5d0)
  sheet.getRange(subtotalRow, 2, 1, 8).setBackground('#ffe5d0');
  sheet.getRange(totalRow, 2, 1, 8).setBackground('#ffe5d0');
  sheet.getRange(subtotalRow, 8).setFontColor('red');
  sheet.getRange(totalRow, 8).setFontColor('red');

  sheet.getRange(subtotalRow, 2).setFontWeight('bold'); // B열
  sheet.getRange(subtotalRow, 9).setFontWeight('bold'); // I열
  sheet.getRange(totalRow, 2).setFontWeight('bold');    // B열
  sheet.getRange(totalRow, 9).setFontWeight('bold');    // I열
  sheet.getRange(infoRow, 2).setFontWeight('bold');     // '도어링 계좌번호'
  sheet.getRange(infoRow, 6).setFontWeight('bold');     // '고객센터 전화번호'
  // 모든 셀 가운데 정렬
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, lastRow, lastCol).setHorizontalAlignment('center').setVerticalAlignment('middle');

  sheet.getRange('G:H').setNumberFormat('#,##0');

  return ContentService.createTextOutput('Success');
}

function addDoorItem(sheet, startRow, startCol, orderItem) {
  var opts = orderItem.item_options || {};
  var doorTypeResolved = resolveDoorType(opts.door_type, opts.door_type_direct_input);
  var width = opts.door_width || opts.width || '';
  var height = opts.door_height || opts.height || '';
  var doorTypeStr = doorTypeResolved.display + ' (W ' + width + ' x H ' + height + ')';
  sheet.getRange(startRow, startCol, 1, 3).merge();
  sheet.getRange(startRow, startCol).setValue(doorTypeStr);

  // color normalization (string or array): prefer name if present
  var colorStrRaw = ensureColorString(opts.door_color_name || opts.door_color || opts.color || '');
  sheet.getRange(startRow + 1, startCol, 1, 3).merge();
  sheet.getRange(startRow + 1, startCol).setValue('↳ ' + getLastColor(colorStrRaw));

  sheet.getRange(startRow, startCol + 3, 2, 1).merge();
  sheet.getRange(startRow, startCol + 3).setValue(orderItem.item_count);

  sheet.getRange(startRow, startCol + 4, 2, 1).merge();
  sheet.getRange(startRow, startCol + 4).setValue(orderItem.unit_price);

  sheet.getRange(startRow, startCol + 5, 2, 1).merge();
  var qtyCell = sheet.getRange(startRow, startCol + 3).getA1Notation();
  var priceCell = sheet.getRange(startRow, startCol + 4).getA1Notation();
  sheet.getRange(startRow, startCol + 5).setFormula('=' + qtyCell + '*' + priceCell);

  sheet.getRange(startRow, startCol + 6, 2, 1).merge();
  sheet.getRange(startRow, startCol + 6).setValue(opts.note || '');

  sheet.getRange(startRow, startCol, 2, 7).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

function addFinishItem(sheet, row, col, orderItem) {
  // 1. 마감재 색상/사이즈 (3셀 병합)
  var fopts = orderItem.item_options || {};
  var finishStr = '↳ ' + getLastColor(fopts.finish_color_name || fopts.finish_color || '') +
    ' (W ' + (fopts.finish_base_depth || '') +
    ' x H ' + (fopts.finish_base_height || '') + ')';
  sheet.getRange(row, col, 1, 3).merge();
  sheet.getRange(row, col).setValue(finishStr);

  // 2. 개수 (오른쪽 셀)
  sheet.getRange(row, col + 3).setValue(orderItem.item_count);

  // 3. 단가 (오른쪽 셀)
  sheet.getRange(row, col + 4).setValue(orderItem.unit_price);

  // 4. 합계 (오른쪽 셀) - 수식 적용
  var qtyCell = sheet.getRange(row, col + 3).getA1Notation();
  var priceCell = sheet.getRange(row, col + 4).getA1Notation();
  sheet.getRange(row, col + 5).setFormula('=' + qtyCell + '*' + priceCell);

  // 가운데 정렬
  sheet.getRange(row, col, 1, 6).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

function addCabinetItem(sheet, row, col, orderItem) {
  var opts = orderItem.item_options || {};
  var cabinetResolved = resolveCabinetType(opts.cabinet_type, opts.cabinet_type_direct_input);
  var width = opts.cabinet_width || opts.width || '';
  var height = opts.cabinet_height || opts.height || '';
  var depth = opts.cabinet_depth || opts.depth || '';
  var cabinetTypeStr = cabinetResolved.display + ' (W ' + width + ' x H ' + height + ' x D ' + depth + ')';
  sheet.getRange(row, col, 1, 3).merge();
  sheet.getRange(row, col).setValue(cabinetTypeStr);

  var doorColorRaw = ensureColorString(opts.cabinet_color_name || opts.cabinet_color || opts.door_color_name || opts.door_color || '');
  var bodyType = opts.body_type;
  var bodyTypeDirectInput = opts.body_type_direct_input;
  var bodyColorRaw = ensureColorString(opts.body_color_name || opts.body_color || '');
  var bodyText = '';
  if (bodyColorRaw) {
    bodyText = getLastColor(bodyColorRaw);
  } else if (opts.body_material_name) {
    // If body material name provided (from ID->name), prefer it
    bodyText = String(opts.body_material_name);
  } else if (bodyType || bodyTypeDirectInput) {
    bodyText = getBodyType(bodyType, bodyTypeDirectInput);
  } else {
    bodyText = '';
  }
  var colorStr = '↳ 도어 : ' + getLastColor(doorColorRaw) + ' / 바디 : ' + bodyText;
  sheet.getRange(row + 1, col, 1, 3).merge();
  sheet.getRange(row + 1, col).setValue(colorStr);

  sheet.getRange(row, col + 3, 2, 1).merge();
  sheet.getRange(row, col + 3).setValue(orderItem.item_count);

  sheet.getRange(row, col + 4, 2, 1).merge();
  sheet.getRange(row, col + 4).setValue(orderItem.unit_price);

  sheet.getRange(row, col + 5, 2, 1).merge();
  var qtyCell = sheet.getRange(row, col + 3).getA1Notation();
  var priceCell = sheet.getRange(row, col + 4).getA1Notation();
  sheet.getRange(row, col + 5).setFormula('=' + qtyCell + '*' + priceCell);

  sheet.getRange(row, col + 6, 2, 1).merge();
  sheet.getRange(row, col + 6).setValue(opts.note || '');

  sheet.getRange(row, col, 2, 7).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

function addAccessoryItem(sheet, row, col, orderItem) {
  var opts = orderItem.item_options || {};
  var rawType = opts.accessory_type;
  var canonical = canonicalAccessoryType(rawType);
  sheet.getRange(row, col, 1, 3).merge();
  sheet.getRange(row, col).setValue(getAccessoryType(canonical));
  sheet.getRange(row, col + 3).setValue(orderItem.item_count);
  sheet.getRange(row, col + 4).setValue(orderItem.unit_price);
  var qtyCell = sheet.getRange(row, col + 3).getA1Notation();
  var priceCell = sheet.getRange(row, col + 4).getA1Notation();
  sheet.getRange(row, col + 5).setFormula('=' + qtyCell + '*' + priceCell);
  sheet.getRange(row, col, 1, 6).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

function addHardwareItem(sheet, row, col, orderItem) {
  var opts = orderItem.item_options || {};
  var rawType = opts.hardware_type;
  var canonical = canonicalHardwareType(rawType);
  sheet.getRange(row, col, 1, 3).merge();
  sheet.getRange(row, col).setValue(getHardwareType(canonical));
  sheet.getRange(row, col + 3).setValue(orderItem.item_count);
  sheet.getRange(row, col + 4).setValue(orderItem.unit_price);
  var qtyCell = sheet.getRange(row, col + 3).getA1Notation();
  var priceCell = sheet.getRange(row, col + 4).getA1Notation();
  sheet.getRange(row, col + 5).setFormula('=' + qtyCell + '*' + priceCell);
  sheet.getRange(row, col, 1, 6).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

function setBorder(sheet, rangeStr) {
  var range = sheet.getRange(rangeStr);
  // 전체 테두리(바깥+안쪽) 굵은 실선
  range.setBorder(true, true, true, true, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_THICK);
  // 안쪽 경계선(가로/세로)만 얇은 실선로 덮어쓰기
  range.setBorder(null, null, null, null, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
}

function getDoorType(type) {
  if (type === 'FLAP') return '플랩문';
  if (type === 'STANDARD') return '일반문';
  if (type === 'DRAWER') return '서랍문';
  return type;
}
function getCabinetType(type) {
  if (type === 'LOWER') return '하부장';
  if (type === 'FLAP') return '플랩장';
  if (type === 'DRAWER') return '서랍장';
  if (type === 'UPPER') return '상부장';
  if (type === 'OPEN') return '오픈장';
  return type;
}
function getAccessoryType(type) {
  // Accept canonical or domain uppercase
  var t = String(type);
  if (t === 'cooktop' || t === 'COOKTOP') return '쿡탑';
  if (t === 'hood' || t === 'HOOD') return '후드';
  if (t === 'sinkbowl' || t === 'SINK') return '싱크볼';
  return t;
}
function getHardwareType(type) {
  var t = String(type);
  if (t === 'bolt' || t === 'PIECE') return '피스';
  if (t === 'rail' || t === 'RAIL') return '레일';
  if (t === 'hinge' || t === 'HINGE') return '경첩';
  return t;
}

function getLastColor(str) {
  var arr = str.split(',');
  return arr[arr.length - 1].trim();
}

function getBodyType(str, directInput) {
  if (str === 'DIRECT_INPUT' && directInput) return '(직접 입력) ' + directInput;
  if (str && str.startsWith && str.startsWith('PATAGONIA')) return '파타고니아';
  if (str && str.startsWith && str.startsWith('HERRINGBONE')) return '헤링본';
  if (str === 'DIRECT_INPUT') return '(직접 입력)';
  return str || '';
}

// Product type normalization: Accept DetailProductType variants mapping to base categories.
function normalizeProductType(pt) {
  if (!pt) return pt;
  var raw = String(pt);
  // Korean synonyms
  if (raw === '문짝' || raw === '도어') return 'DOOR';
  if (raw === '마감재') return 'FINISH';
  if (raw === '부속') return 'ACCESSORY';
  if (raw === '하드웨어') return 'HARDWARE';
  if (raw === '부분장') return 'CABINET';

  var p = raw.toUpperCase();
  if (p === 'DOOR') return 'DOOR';
  if (p === 'FINISH') return 'FINISH';
  if (p === 'ACCESSORY') return 'ACCESSORY';
  if (p === 'HARDWARE' || p === 'HINGE' || p === 'RAIL' || p === 'PIECE') return 'HARDWARE';
  // Detail cabinet variants
  if (p.indexOf('CABINET') !== -1) return 'CABINET';
  return p; // fallback
}

