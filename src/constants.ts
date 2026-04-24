import { QuizQuestion, CipherProblem, CipherMissionData } from './types';

export const DECODING_TABLE: Record<number, string> = {
  0: 'ㄱ', 1: 'ㄴ', 2: 'ㄷ', 3: 'ㄹ', 4: 'ㅁ', 5: 'ㅂ', 6: 'ㅅ', 
  7: 'ㅇ', 8: 'ㅈ', 9: 'ㅊ', 10: 'ㅋ', 11: 'ㅌ', 12: 'ㅍ', 13: 'ㅎ'
};

export const CIPHER_MISSION_POOL: CipherMissionData[] = [
  {
    finalWord: '입력장치',
    hint: '키보드나 마우스처럼 데이터를 넣는 도구예요.',
    problems: [
      { expression: '5 + 2', answer: 7, consonant: 'ㅇ' },
      { expression: '8 - 5', answer: 3, consonant: 'ㄹ' },
      { expression: '10 - 2', answer: 8, consonant: 'ㅈ' },
      { expression: '4 + 5', answer: 9, consonant: 'ㅊ' },
    ]
  },
  {
    finalWord: '알고리즘',
    hint: '문제를 해결하기 위해 정해진 단계별 규칙이에요.',
    problems: [
      { expression: '12 - 5', answer: 7, consonant: 'ㅇ' },
      { expression: '5 - 5', answer: 0, consonant: 'ㄱ' },
      { expression: '1 + 2', answer: 3, consonant: 'ㄹ' },
      { expression: '4 + 4', answer: 8, consonant: 'ㅈ' },
    ]
  },
  {
    finalWord: '저장장치',
    hint: '주판알의 위치처럼 데이터를 기억하는 곳이에요.',
    problems: [
      { expression: '3 + 5', answer: 8, consonant: 'ㅈ' },
      { expression: '9 - 1', answer: 8, consonant: 'ㅈ' },
      { expression: '2 + 6', answer: 8, consonant: 'ㅈ' },
      { expression: '10 - 1', answer: 9, consonant: 'ㅊ' },
    ]
  },
  {
    finalWord: '프로그램',
    hint: '컴퓨터가 실행하는 명령어들의 모음이에요.',
    problems: [
      { expression: '6 + 6', answer: 12, consonant: 'ㅍ' },
      { expression: '13 - 10', answer: 3, consonant: 'ㄹ' },
      { expression: '0 + 0', answer: 0, consonant: 'ㄱ' },
      { expression: '9 - 6', answer: 3, consonant: 'ㄹ' },
    ]
  }
];

export const SW_QUIZ_POOL: QuizQuestion[] = [
  {
    question: "주판의 '가름대'에 모인 알의 모양은 컴퓨터의 무엇과 같을까요?",
    options: ["입력 장치", "처리 장치(CPU)", "출력 장치(모니터)", "저장 장치"],
    correctIdx: 2,
    explanation: "주판알의 모양은 계산 결과를 보여주므로 컴퓨터의 모니터와 같은 출력 장치 역할을 해요!"
  },
  {
    question: "주판알을 움직이는 '손가락'은 컴퓨터의 어떤 부분에 해당하나요?",
    options: ["입력 장치(마우스/키보드)", "저장 장치", "출력 장치", "전원 버튼"],
    correctIdx: 0,
    explanation: "손가락으로 숫자를 입력하므로 컴퓨터의 키보드나 마우스 같은 입력 장치와 같아요."
  },
  {
    question: "주판알의 '현재 위치'는 정보를 기억하는 기능을 합니다. 이것은 무엇일까요?",
    options: ["충전기", "메모리(저장 장치)", "데이터 스위치", "스피커"],
    correctIdx: 1,
    explanation: "주판알이 놓인 자리가 숫자를 저장하고 있으므로 RAM이나 하드디스크 같은 저장 장치예요."
  },
  {
    question: "문제를 해결하기 위한 '단계별 규칙'을 무엇이라고 부르나요?",
    options: ["알고리즘", "디버깅", "하드웨어", "모니터"],
    correctIdx: 0,
    explanation: "컴퓨터나 주판으로 문제를 풀기 위한 정해진 규칙을 '알고리즘'이라고 해요."
  },
  {
    question: "새로운 계산을 위해 주판의 알을 모두 0으로 만드는 과정은?",
    options: ["데이터 압축", "시스템 초기화(리셋)", "프로그램 설치", "인터넷 연결"],
    correctIdx: 1,
    explanation: "불필요한 정보를 지우고 처음 상태로 돌리는 것은 시스템 초기화(Reset)와 같아요."
  },
  {
    question: "주판알 5개를 윗알 1개로 바꾸어 표현하는 기술은 무엇과 같을까요?",
    options: ["데이터 압축", "네트워크 오류", "백신 프로그램", "배터리 절약"],
    correctIdx: 0,
    explanation: "많은 정보(알 5개)를 작은 공간(알 1개)에 효율적으로 담는 것은 데이터 압축 기술이에요."
  },
  {
    question: "주판알이 가름대에 닿았는지(ON), 떨어졌는지(OFF)로 숫자를 표시하는 원리는?",
    options: ["아날로그 시계", "이진법(데이터 스위치)", "자율주행", "인공지능"],
    correctIdx: 1,
    explanation: "컴퓨터가 0과 1로 정보를 기억하듯, 주판도 알의 위치로 0과 1의 상태를 나타내요."
  },
  {
    question: "우리 머릿속에 있는 보수 연산 등의 계산 규칙은 무엇에 해당할까요?",
    options: ["무거운 하드웨어", "소프트웨어/프로그램", "컴퓨터 케이스", "마우스 패드"],
    correctIdx: 1,
    explanation: "만질 수는 없지만 머릿속에서 작동하는 계산 규칙이 바로 소프트웨어랍니다."
  }
];
