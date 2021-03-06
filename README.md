# Avoid Blobs Remaster

Remastering Avoid Blobs more better

[프로젝트 링크](https://pshtony1.github.io/test-game/)

## 구현한 것들

- 2021-04-10

  - 반응형 캔버스 구현
  - Player의 물리적 움직임 구현
  - Player / Frame 간의 충돌 구현
  - Frame Animation 구현

- 2021-04-11

  - 메인 화면 구성
  - 플레이어 색상 변경(color-box) 구현
  - Eater의 기본적인 기능 구현(Animation, Player와 충돌시 사망)
  - 자질구레한 버그와 resize 이벤트 개선

- 2021-04-11

  - 게임 Timer 구현
  - 최고 점수 구현
  - Eater의 중력(빨아들임) 구현
  - Enemy 구현
  - Eater / Enemy 충돌 구현(Animation, 크기 증가)

- 2021-04-12

  - Frame Animation 확장성있게 수정
  - 중력 버그 개선(일정 범위를 넘어가면 역중력이 발생하는 버그)
  - 타이머 버그 수정(게임이 끝나도 타이머가 유지되는 버그)

- 2021-04-13

  - Effect 완성(Animation 까지)

- 2021-04-14

  - Eater의 Wave Animation 구현 완료

- 2021-04-15

  - Eater Wave Animation을 먹은 Enemy의 위치와 상호작용하도록 개선
  - Player와 time text가 닿으면 text의 opacity 변경되게 구현

## 문제를 해결한 것들

- 2021-04-10

  - 클로저를 이용해 Canvas Animation을 쉽게 구현했다.
  - keydown을 이용해 Player의 움직임을 구현했을 때 불편한 것 해결함.

- 2021-04-11 ~ 2021-04-13

  - 대단히 막혔던 부분은 없음.

- 2021-04-14 ~ 2021-04-15

  - 원형 Wave 알고리즘

## 아이디어

- [ ] Player 색 슬라이드로 고를 수 있게
- [ ] text move animation
