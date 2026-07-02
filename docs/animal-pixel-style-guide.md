# 동물 픽셀아트 키워드 빌더 (마스터 가이드)

> 가계부 앱 "LEE" — 고양이집 가챠/상점용 동물 스프라이트 생성 규칙
> 사용법: **아래 리스트에서 항목별로 하나씩 골라 순서대로 이으면** 프롬프트가 완성된다.
> 통통·큰머리는 이제 **고정이 아니라 선택**(8번 리스트). 실사 느낌은 32px + Detail Low가 막아준다.

---

## 0. 쓰는 법 (3단계)

1. 아래 **조립 순서**대로 각 리스트에서 원하는 걸 하나씩 고른다. (3~8번은 건너뛰어도 됨)
2. 고른 것들을 콤마로 잇는다.
3. 맨 뒤에 **고정 렌더링 꼬리말**을 붙인다 → 완성.

### ▎조립 순서 (빈칸 채우기)

```
simple pixel art [2.색] [1.종], [3.무늬], [4.눈], [5.얼굴디테일], [6.꼬리], [7.표정], [8.체형(선택)], [고정 렌더링 꼬리말]
```

- **필수**: 1.종 + 2.색 + 고정 꼬리말
- **선택**: 3~8번. 보통 **2~4개만** 넣는 게 제일 안정적이고 귀엽다. 너무 많이 넣으면 결과가 흔들린다.

### ▎고정 렌더링 꼬리말 (항상 맨 뒤에 그대로)

```
very simple, minimal detail, few colors, chunky pixels, thick black outline, flat colors, cute, cozy
```

`simple pixel art` 프리픽스와 이 꼬리말만 고정이다. 나머지는 전부 리스트에서 골라 바꾼다.

---

## 1. 종 (Species) — 필수, 20종 + 추가

| 영어 | 한글 |
|---|---|
| cat | 고양이 |
| kitten | 새끼 고양이 |
| dog | 개 |
| puppy | 강아지 |
| rabbit | 토끼 |
| hamster | 햄스터 |
| turtle | 거북이 |
| wolf | 늑대 |
| fox | 여우 |
| alpaca | 알파카 |
| capybara | 카피바라 |
| bear | 곰 |
| panda | 판다 |
| penguin | 펭귄 |
| frog | 개구리 |
| hedgehog | 고슴도치 |
| deer | 사슴 |
| raccoon | 너구리 |
| otter | 수달 |
| squirrel | 다람쥐 |

추가 후보: `duck 오리` · `sheep 양` · `tiger 호랑이` · `red panda 레서판다` · `shiba dog 시바견` · `corgi 코기` · `chick 병아리` · `owl 부엉이`

---

## 2. 색 / 털 (Color & Coat) — 필수

| 영어 | 한글 |
|---|---|
| white | 하양 |
| black | 검정 |
| grey | 회색 |
| blue-grey | 청회색 (러시안블루 톤) |
| orange (ginger) | 주황 (치즈) |
| cream | 크림색 |
| brown | 갈색 |
| chocolate brown | 초코 갈색 |
| golden | 금빛 |
| tan | 황갈색 |
| calico (white with orange and black patches) | 삼색 (흰+주황+검정) |
| black and white | 흑백 (젖소·턱시도) |
| pink | 분홍 |
| mint green | 민트색 |

**털 질감(선택으로 색 뒤에 덧붙임)**: `fluffy fur 복슬복슬` · `glossy fur 윤기나는` · `plush fur 도톰한` · `smooth fur 매끈한`

---

## 3. 무늬 / 품종 디테일 (Pattern) — 선택

| 영어 | 한글 |
|---|---|
| (없음) | 무늬 없음 |
| a few tabby stripes | 태비 줄무늬 몇 개 |
| a few cheese tabby stripes | 치즈 태비 줄무늬 |
| forehead M marking | 이마 M자 무늬 (태비 시그니처) |
| striped tail | 줄무늬 꼬리 |
| a few round spots | 동그란 반점 몇 개 |
| big patches | 큰 얼룩 |
| one patch over one eye | 한쪽 눈 얼룩 |
| color point face and ears | 얼굴·귀만 진한 포인트 (샴) |
| cream belly | 크림색 배 |
| white chest | 흰 가슴 |
| spotted back | 등에 점무늬 |

> `tabby` 등 품종 무늬는 OK. 단 `a few`로 단순하게. `photorealistic`·`detailed shading`만 금지.

---

## 4. 눈 (Eyes) — 선택

| 영어 | 한글 |
|---|---|
| big round eyes | 큰 동그란 눈 |
| big cute eyes | 크고 귀여운 눈 |
| sleepy half-closed eyes | 졸린 반쯤 감은 눈 |
| dot eyes | 점 눈 (동공 없는 까만 점) |
| pale blue eyes | 연한 파란 눈 |
| blue eyes | 파란 눈 |
| green eyes | 초록 눈 |
| amber eyes | 호박색 눈 |
| gold eyes | 금색 눈 |
| copper eyes | 구릿빛 눈 |
| yellow eyes | 노란 눈 |
| big dark eyes | 크고 검은 눈 |
| odd eyes (one blue one amber) | 오드아이 (파랑+호박) |

---

## 5. 얼굴 / 귀 디테일 (Face detail) — 선택

| 영어 | 한글 |
|---|---|
| pink inner ears | 분홍 귀 안쪽 |
| pink nose | 분홍 코 |
| white muzzle | 흰 입 주변 |
| white chin | 흰 턱 |
| tiny fangs | 작은 송곳니 |
| small round cheeks | 작고 동그란 볼 |
| rosy cheeks | 발그레한 볼 |
| big soft ears | 크고 부드러운 귀 |
| folded ears | 접힌 귀 (스코티시폴드) |
| pointy ears | 뾰족한 귀 (늑대·여우) |
| floppy ears | 늘어진 귀 (개) |
| long upright ears | 길게 선 귀 (토끼) |

---

## 6. 꼬리 (Tail) — 선택

| 영어 | 한글 |
|---|---|
| short tail | 짧은 꼬리 |
| short stubby tail | 짧고 뭉툭한 꼬리 |
| bobtail | 꼬리 거의 없음 |
| long fluffy tail | 길고 복슬한 꼬리 |
| bushy tail | 풍성한 꼬리 (여우·늑대) |
| curled tail | 말린 꼬리 (스피츠) |
| slim tail | 가는 꼬리 |

---

## 7. 표정 (Expression) — 선택

| 영어 | 한글 |
|---|---|
| sleepy expression | 졸린 표정 |
| content expression | 만족한 표정 |
| cheerful expression | 명랑한 표정 |
| curious expression | 호기심 어린 표정 |
| playful expression | 장난기 있는 표정 |
| mischievous expression | 짓궂은 표정 |
| calm expression | 차분한 표정 |
| gentle expression | 온화한 표정 |
| goofy happy expression | 헤벌쭉 행복한 표정 |
| shy expression | 수줍은 표정 |
| grumpy expression | 뚱한 표정 |
| proud expression | 도도한 표정 |

---

## 8. 체형 / 비율 (Body) — 선택 (이제 고정 아님)

| 영어 | 한글 |
|---|---|
| (없음) | 기본 비율 |
| chubby round body | 통통 동그란 몸 |
| big head, short legs | 큰 머리 + 짧은 다리 |
| extra round and plump | 아주 통통 |
| tiny, baby proportions | 작은 아기 비율 |
| round shell body | 둥근 등딱지 몸 (거북이) |
| long fluffy neck, thin legs | 길고 복슬한 목 + 가는 다리 (알파카) |
| big round body, blunt nose | 크고 뭉툭한 몸 (카피바라) |

> 종이 달라지면 구별은 실루엣에서 공짜로 따라온다(토끼 귀·거북이 등딱지·여우 꼬리). 체형이 특이한 종만 이 리스트에서 맞는 걸 골라 넣으면 된다.

---

## 9. 조립 예시 (그대로 복붙 가능)

**① 하양 고양이 (통통·복슬)** — 1.cat 2.white+fluffy 4.pale blue 5.pink inner ears 7.sleepy 8.chubby
```
simple pixel art white cat, fluffy fur, pale blue eyes, pink inner ears, sleepy expression, chubby round body, very simple, minimal detail, few colors, chunky pixels, thick black outline, flat colors, cute, cozy
```

**② 새끼 치즈 태비 고양이** — 1.kitten 2.orange 3.cheese tabby+M 4.gold 5.white muzzle 6.short stubby tail 7.playful
```
simple pixel art orange tabby kitten, a few cheese tabby stripes, forehead M marking, gold eyes, white muzzle, short stubby tail, playful expression, very simple, minimal detail, few colors, chunky pixels, thick black outline, flat colors, cute, cozy
```

**③ 여우 (비-고양이 예시)** — 1.fox 2.orange 3.white chest 4.amber 5.pointy ears 6.bushy tail 7.curious
```
simple pixel art orange fox, white chest, amber eyes, pointy ears, bushy tail, curious expression, very simple, minimal detail, few colors, chunky pixels, thick black outline, flat colors, cute, cozy
```

**④ 거북이 (체형 교체 예시)** — 1.turtle 2.green 7.cheerful 8.round shell body
```
simple pixel art green turtle, round shell body, tiny head, small eyes, cheerful expression, very simple, minimal detail, few colors, chunky pixels, thick black outline, flat colors, cute, cozy
```

---

## 10. PixelLab 사용법 (Create Character)

접속: **https://www.pixellab.ai/create-character/new**
*(스크린샷은 각 단계 아래 슬롯에 직접 캡처를 넣으면 된다. 파일은 `screenshots/` 폴더에 두고 파일명만 맞추면 MD에서 바로 보인다.)*

### 단계별 설정 (현재 UI 기준)

**① Create from Text 탭** — 텍스트로 생성 (기본값). "Create from Reference"는 참고 이미지 기반이라 여기선 안 씀.

**② Character Type → `Quadruped`** — 네발 동물(고양이·개·곰 등). Humanoid 아님.

![1. Character Type - Quadruped 선택](screenshots/pixellab-01-type.png)

**③ Generation Mode → `Standard`** — v3는 Pro/구독자용(생성 2회 소모). 무료는 Standard 권장.

**④ Character Description (필수)** — 여기에 **9번에서 조립한 프롬프트를 그대로 붙여넣기.** 사이트 안내문도 "색·특징·스타일을 구체적으로 쓰라"고 함. 남향(정면) 스프라이트가 생성된 뒤 여러 방향으로 회전됨.

![2. Description에 조립 프롬프트 붙여넣기](screenshots/pixellab-02-desc.png)

**⑤ Camera View → `Sidescroller`** — 옆에서 본 시점(도크에서 걷는 용도).

**⑥ Sprite Size → `32px`** (기본 48 → 32로 변경). *실사 방지의 핵심.* 캔버스는 애니메이션 여유분 때문에 실제로는 더 크게 패딩됨.

**⑦ Detail → `Low detail`** 쪽으로 슬라이더. (Highly detailed ↔ Low detail 중 Low.) *32px와 함께 실사 방지 담당.*

**⑧ Outline → `Black outline`** — 단색 검정 외곽선.

![3. Size 32 / Detail Low / Black outline](screenshots/pixellab-03-settings.png)

**⑨ `Generate Character`** 클릭 → 생성.

### 요약 표 (현재 UI 필드 → 값)

| UI 필드 | 값 |
|---|---|
| 탭 | Create from Text |
| Character Type | **Quadruped** |
| Generation Mode | Standard (무료) |
| Character Description | 9번 조립 프롬프트 붙여넣기 |
| Camera View | **Sidescroller** |
| Sprite Size | **32px** |
| Detail | **Low detail** |
| Outline | **Black outline** |

> 실사 방지는 **32px + Detail Low**가 담당. 그래서 체형(8번) 단어를 안 넣어도 과하게 사실적이지 않다.

### 생성 후 — 걷기 애니메이션 & export

1. 캐릭터가 생성되면 **Walk 애니메이션(6-frame)** 을 만든다 (도크에서 걷는 밸런스에 6프레임이 적당).
2. **투명 배경 PNG 스프라이트 시트**로 export.
3. 그 시트를 앱에 넣고 CSS `steps()`로 애니메이션 → `#catdock`에 연결.

> ⚠️ 앱에 넣을 때 스프라이트 경로는 **문서 기준 절대 URL**로. `--sheet:url(assets/…)`를 상대경로로 두면 `styles.css` 기준으로 `/css/assets/…`가 돼서 404 → 고양이가 안 보인다. (지난 버그 원인)

---

## 11. 팁 & 체크리스트

- **새 종은 1마리만 먼저** 뽑아 톤 확인 → 맞으면 같은 설정으로 쭉.
- 결과가 흔들리면 → 선택 항목(3~8) 중 **덜 중요한 것부터 뺀다.** 품종 무늬(태비 등)는 마지막까지 남긴다.
- 각 종은 6-frame **Walk** 애니메이션으로 export (도크용).

**생성 전 3초 점검**
- [ ] `simple pixel art [색] [종]`으로 시작했나?
- [ ] 고정 렌더링 꼬리말이 맨 뒤에 그대로 있나?
- [ ] 선택 항목이 2~4개 이내인가? (너무 많지 않게)
- [ ] `photorealistic`·`detailed shading` 안 들어갔나? (`tabby`·품종 디테일은 OK)
- [ ] 눈·디테일·표정 중 하나라도 옆 개체와 다른가? (색만 다르게 X)

---

*이 문서가 마스터 빌더다. 새 개체 = 리스트에서 안 겹치는 조합 하나 고르기. 새 키워드가 필요하면 해당 번호 리스트에 영어+한글로 한 줄만 추가하면 된다.*
