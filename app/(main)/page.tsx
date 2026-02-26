import Link from 'next/link';
import type { Metadata } from 'next';
import {
  BookOpen,
  Code,
  BarChart3,
  Palette,
  Briefcase,
  Megaphone,
  Languages,
  GraduationCap,
  Users,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Learniverse — 배움의 우주',
};

const FEATURES = [
  {
    icon: BookOpen,
    title: '체계적인 커리큘럼',
    description: '카테고리별 강의와 레슨으로 구성된 단계적 학습 경로',
  },
  {
    icon: ClipboardCheck,
    title: '과제 & 피드백',
    description: '실습 과제 제출과 튜터의 1:1 피드백으로 실력 향상',
  },
  {
    icon: Users,
    title: '튜터 대시보드',
    description: '강의 생성, 수강생 관리, 과제 평가를 한 곳에서',
  },
  {
    icon: GraduationCap,
    title: '학습 진도 추적',
    description: '레슨별 진도율 확인과 수강 완료 자동 인정',
  },
];

const CATEGORIES = [
  { icon: Code, label: '프로그래밍' },
  { icon: BarChart3, label: '데이터 사이언스' },
  { icon: Palette, label: '디자인' },
  { icon: Briefcase, label: '비즈니스' },
  { icon: Megaphone, label: '마케팅' },
  { icon: Languages, label: '어학' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-24 text-center md:py-32">
          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight md:text-6xl">
            배움의 우주,{' '}
            <span className="text-primary">Learniverse</span>
          </h1>
          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: '0.1s' }}>
            프로그래밍부터 디자인까지, 원하는 분야의 강의를 탐색하고
            체계적인 커리큘럼으로 성장하세요.
          </p>
          <div className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" asChild>
              <Link href="/courses">강의 둘러보기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">무료로 시작하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold">왜 Learniverse인가요?</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          학습자와 튜터 모두를 위한 올인원 교육 플랫폼
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold">다양한 카테고리</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            관심 분야를 선택하고 학습을 시작하세요
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href="/courses"
                className="flex flex-col items-center gap-3 rounded-xl border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
              >
                <cat.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">지금 바로 시작하세요</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          무료 회원가입 후 다양한 강의를 탐색해보세요.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/register">회원가입</Link>
        </Button>
      </section>
    </>
  );
}
