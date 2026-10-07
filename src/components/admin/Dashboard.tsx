import { ArrowUpRight, BriefcaseBusiness, FolderOpen, Globe, Layers } from 'lucide-react';
import Link from 'next/link';

const cards = [
  {
    href: '/admin/site',
    title: '사이트',
    description: '소개, 연락처와 검색 정보를 관리합니다.',
    icon: Globe,
  },
  {
    href: '/admin/projects',
    title: '프로젝트',
    description: '프로젝트와 상세 콘텐츠를 편집합니다.',
    icon: FolderOpen,
  },
  {
    href: '/admin/experiences',
    title: '경험',
    description: '경력과 활동 내역을 관리합니다.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/admin/tech-groups',
    title: '기술 스택',
    description: '기술 그룹과 표시 순서를 정리합니다.',
    icon: Layers,
  },
];

export default function Dashboard() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <p className="admin-eyebrow">YOUR WORKSPACE</p>
        <h1 className="admin-title">포트폴리오 관리</h1>
        <p className="admin-muted">소개부터 프로젝트까지, 지금의 나를 담아보세요.</p>
      </header>
      <div className="admin-dashboard-grid">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="admin-card admin-dashboard-card">
            <Icon size={24} aria-hidden="true" />
            <h2>
              {title}
              <ArrowUpRight size={18} aria-hidden="true" />
            </h2>
            <p className="admin-muted">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
