import type { InputMap, ProjectTemplate, Resource } from '@/types/admin';

export type Field = {
  label: string;
  type?: 'text' | 'textarea' | 'email' | 'url' | 'number' | 'checkbox' | 'select';
  maxLength?: number;
  pattern?: string;
  options?: { value: string; label: string }[];
  optional?: boolean;
  nullable?: boolean;
  hint?: string;
  fields?: Record<string, Field>;
  item?: Field;
  maxItems?: number;
};
const text = (label: string, extra: Partial<Field> = {}): Field => ({
  label,
  maxLength: 500,
  ...extra,
});
const paragraph = (label: string): Field => ({
  label,
  type: 'textarea',
  maxLength: 10000,
  hint: '줄바꿈과 **강조** 표기를 그대로 보존합니다.',
});
const object = (label: string, fields: Record<string, Field>, optional = false): Field => ({
  label,
  fields,
  optional,
});
const array = (label: string, item: Field, maxItems = 100, optional = false): Field => ({
  label,
  item,
  maxItems,
  optional,
});
const paragraphs = (label: string, optional = false) =>
  array(label, paragraph('문단'), 100, optional);
const labels = (label: string) => array(label, text('항목', { maxLength: 200 }));
const icon = (label: string, optional = false) =>
  text(label, {
    maxLength: 80,
    pattern: '[a-zA-Z0-9_\\-]{1,80}',
    optional,
    hint: '영문·숫자·밑줄·하이픈으로 된 기존 아이콘 키를 입력하세요.',
  });
const url = (label: string, nullable = false) =>
  text(label, {
    type: 'url',
    maxLength: 2048,
    pattern: '[hH][tT][tT][pP][sS]?://.*',
    nullable,
    hint: 'http:// 또는 https:// 주소',
  });
const select = (label: string, options: [string, string][], optional = false): Field => ({
  label,
  type: 'select',
  options: options.map(([value, label]) => ({ value, label })),
  optional,
});
const flags: Record<string, Field> = {
  isPublished: { label: '공개', type: 'checkbox' },
  sortOrder: { label: '표시 순서', type: 'number', hint: '0~100000, 작은 숫자부터 표시됩니다.' },
};
const section = object('섹션', {
  title: text('섹션 제목'),
  paragraphs: paragraphs('본문 문단', true),
  list: paragraphs('목록', true),
  paragraphsAfterList: paragraphs('목록 뒤 문단', true),
  steps: array(
    '단계',
    object('단계', { title: text('단계 제목'), list: paragraphs('단계 목록') }),
    50,
    true,
  ),
});
export const PROJECT_FIELDS: Record<ProjectTemplate, Field> = {
  'case-study': object('케이스 스터디', {
    overview: object('개요', { title: text('개요 제목'), detail: paragraphs('개요 문단') }),
    contribution: object('기여', {
      title: text('기여 제목'),
      items: array(
        '기여 항목',
        object('기여 항목', { title: text('항목 제목'), paragraphs: paragraphs('문단') }),
        50,
      ),
    }),
    troubleShooting: object('트러블 슈팅', {
      title: text('트러블 슈팅 제목'),
      cases: array(
        '사례',
        object('사례', {
          caseTitle: text('사례 제목'),
          layout: select(
            '배치 방식',
            [
              ['grid', '격자'],
              ['zigzag', '지그재그'],
            ],
            true,
          ),
          sections: array('섹션', section, 50),
        }),
        50,
      ),
    }),
    review: object('회고', { title: text('회고 제목'), detail: paragraphs('회고 문단') }),
    techStack: object('기술 스택', {
      title: text('기술 스택 제목'),
      groups: array(
        '기술 그룹',
        object('기술 그룹', {
          groupTitle: text('그룹 제목'),
          items: array(
            '기술',
            object('기술', {
              name: text('기술 이름'),
              description: paragraph('기술 설명'),
              icon: icon('아이콘 키', true),
              iconVariant: select(
                '아이콘 색상',
                [
                  ['light', '밝게'],
                  ['dark', '어둡게'],
                  ['grayscale', '흑백'],
                ],
                true,
              ),
            }),
          ),
        }),
        50,
      ),
    }),
    peerReview: object(
      '동료 평가',
      { strengths: paragraphs('강점'), improvements: paragraphs('개선점') },
      true,
    ),
  }),
  changelog: object('변경 기록', {
    entries: array(
      '기록',
      object('변경 기록', {
        date: text('날짜 표기', { optional: true }),
        title: text('변경 제목', { optional: true }),
        reason: paragraph('변경 이유'),
        action: paragraph('수행 내용'),
        result: paragraph('결과'),
      }),
      200,
    ),
  }),
  none: object('상세 콘텐츠 없음', {}),
};
export const CONTENT_FIELDS: Record<Resource | 'site', Field> = {
  site: object('사이트 콘텐츠', {
    profile: object('프로필', {
      displayName: text('표시 이름'),
      brandName: text('브랜드 이름'),
      email: text('연락 이메일', { type: 'email', maxLength: 254 }),
      githubUrl: url('GitHub 주소'),
      copyright: text('저작권 문구'),
    }),
    hero: object('첫 화면', {
      eyebrow: text('상단 문구'),
      title: text('제목'),
      description: paragraph('소개 문구'),
      ctaLabel: text('버튼 문구'),
    }),
    about: object('소개', { title: text('소개 제목'), paragraphs: paragraphs('소개 문단') }),
    contact: object('연락', {
      title: text('제목'),
      description: paragraph('설명'),
      message: paragraph('메시지'),
    }),
    seo: object('검색 엔진', {
      title: text('SEO 제목'),
      description: text('SEO 설명', { maxLength: 1000 }),
    }),
    sections: object('섹션 문구', {
      experience: text('경험 제목'),
      techStack: text('기술 스택 제목'),
      projects: text('주요 프로젝트 제목'),
      sideProjects: text('사이드 프로젝트 제목'),
      projectsPageTitle: text('프로젝트 목록 제목'),
      projectsPageDescription: paragraph('프로젝트 목록 설명'),
      majorProjectsDescription: paragraph('주요 프로젝트 설명'),
      sideProjectsDescription: paragraph('사이드 프로젝트 설명'),
      etcProjects: text('기타 프로젝트 제목'),
      etcProjectsDescription: paragraph('기타 프로젝트 설명'),
    }),
  }),
  experiences: object('경험', {
    title: text('경험 제목'),
    organization: text('기관·회사'),
    period: text('활동 기간'),
    iconKey: icon('아이콘 키'),
    responsibilities: paragraphs('담당 업무'),
    skills: labels('기술'),
    ...flags,
  }),
  'tech-groups': object('기술 그룹', {
    title: text('그룹 제목'),
    items: array(
      '기술',
      object('기술', { name: text('기술 이름'), iconName: icon('아이콘 키', true) }),
    ),
    ...flags,
  }),
  projects: object('프로젝트', {
    slug: text('슬러그', {
      maxLength: 120,
      pattern: '[a-z0-9]+(?:-[a-z0-9]+)*',
      hint: '영문 소문자·숫자·하이픈. 생성 후 변경할 수 없습니다.',
    }),
    title: text('프로젝트 제목'),
    category: select('분류', [
      ['major', '주요'],
      ['side', '사이드'],
      ['etc', '기타'],
    ]),
    template: select('상세 템플릿', [
      ['case-study', '케이스 스터디'],
      ['changelog', '변경 기록'],
      ['none', '상세 없음'],
    ]),
    subtitle: text('부제', { nullable: true }),
    description: { ...paragraph('프로젝트 설명'), nullable: true },
    imageSrc: text('대표 이미지 경로', {
      maxLength: 2048,
      nullable: true,
      hint: 'http/https 주소 또는 /로 시작하는 사이트 경로. 공백·쿼리·상위 경로는 사용할 수 없습니다.',
    }),
    logoSrc: text('로고 경로', {
      maxLength: 2048,
      nullable: true,
      hint: 'http/https 주소 또는 /로 시작하는 사이트 경로',
    }),
    role: text('담당 역할', { nullable: true }),
    period: text('진행 기간', { nullable: true }),
    repository: url('저장소 주소', true),
    links: array(
      '링크',
      object('링크', {
        type: select('링크 유형', [
          ['fe', '프론트엔드'],
          ['be', '백엔드'],
          ['demo', '데모'],
          ['api', 'API'],
        ]),
        href: url('주소'),
      }),
      4,
    ),
    keywords: labels('키워드'),
    techStack: labels('기술 스택'),
    seo: object('검색 엔진', {
      title: text('SEO 제목', { optional: true }),
      description: text('SEO 설명', { optional: true, maxLength: 1000 }),
    }),
    showOnHome: { label: '홈에 표시', type: 'checkbox' },
    ...flags,
  }),
};
export function fieldDefault(field: Field): unknown {
  if (field.item) return [];
  if (field.fields)
    return Object.fromEntries(
      Object.entries(field.fields)
        .filter(([, child]) => !child.optional)
        .map(([key, child]) => [key, fieldDefault(child)]),
    );
  if (field.nullable) return null;
  if (field.type === 'checkbox') return false;
  if (field.type === 'number') return 0;
  return field.options?.[0]?.value ?? '';
}
export const PROJECT_CONTENT = Object.fromEntries(
  Object.entries(PROJECT_FIELDS).map(([key, field]) => [key, fieldDefault(field)]),
) as {
  [K in ProjectTemplate]: Extract<InputMap['projects'], { template: K }>['content'];
};
export const EMPTY_CONTENT = {
  experiences: fieldDefault(CONTENT_FIELDS.experiences),
  'tech-groups': fieldDefault(CONTENT_FIELDS['tech-groups']),
  projects: {
    ...(fieldDefault(CONTENT_FIELDS.projects) as object),
    content: PROJECT_CONTENT['case-study'],
  },
} as InputMap;
