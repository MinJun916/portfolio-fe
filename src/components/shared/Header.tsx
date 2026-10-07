'use client';

import { GithubOutlined, MailOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AnimationToggle from '@/components/shared/AnimationToggle';
import { showToast } from '@/components/shared/Sonner';
import { Separator } from '@/components/ui/separator';

const EMAIL = 'ed125248@gmail.com';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

const IconLinks = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://github.com/MinJun916"
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="GitHub"
    >
      <GithubOutlined className="text-[18px]" />
    </a>
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(EMAIL);
        showToast({ type: 'success', title: '이메일 주소가 복사되었습니다.' });
      }}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="이메일 주소 복사"
    >
      <MailOutlined className="text-[18px]" />
    </button>
  </div>
);

const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRoot = pathname === '/';
  const isProjectDetail = pathname.startsWith('/projects') && pathname !== '/projects';

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 min-h-14 w-full max-w-[1200px] min-w-0 items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="text-foreground hover:text-foreground/80 text-base font-semibold tracking-tight transition-colors sm:text-lg"
          onClick={
            isRoot
              ? (e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  closeMobileMenu();
                }
              : closeMobileMenu
          }
        >
          MinJun.
        </Link>

        {isRoot ? (
          <>
            <nav className="hidden items-center gap-6 md:flex md:gap-8">
              <ul className="flex items-center gap-6 md:gap-8">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="h-5">
                <Separator orientation="vertical" className="bg-muted-foreground/40 h-full" />
              </div>
              <AnimationToggle />
              <div className="h-5">
                <Separator orientation="vertical" className="bg-muted-foreground/40 h-full" />
              </div>
              <IconLinks />
            </nav>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-foreground flex size-10 items-center justify-center md:hidden"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {isProjectDetail && (
              <>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  프로젝트 목록
                </Link>
                <div className="h-5">
                  <Separator orientation="vertical" className="bg-muted-foreground/40 h-full" />
                </div>
              </>
            )}
            <AnimationToggle />
            <div className="h-5">
              <Separator orientation="vertical" className="bg-muted-foreground/40 h-full" />
            </div>
            <IconLinks />
          </div>
        )}
      </div>

      {isRoot && mobileMenuOpen && (
        <div className="border-border/60 bg-background/95 absolute top-full right-0 left-0 z-40 border-b px-4 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMobileMenu}
                  className="text-foreground hover:bg-muted/50 block rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-border/60 mt-3 flex flex-wrap items-center gap-4 border-t pt-3">
            <AnimationToggle showLabel />
            <a
              href="https://github.com/MinJun916"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              aria-label="GitHub"
            >
              <GithubOutlined className="text-lg" />
              <span className="text-sm">GitHub</span>
            </a>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(EMAIL);
                showToast({ type: 'success', title: '이메일 주소가 복사되었습니다.' });
              }}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              aria-label="이메일 주소 복사"
            >
              <MailOutlined className="text-lg" />
              <span className="text-sm">이메일 복사</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
