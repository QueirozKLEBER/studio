'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Flame, Heart, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const posts = [
  {
    title: 'Como emagrecer com constância',
    category: 'Emagrecimento',
    icon: Flame,
    color: 'text-orange-500',
    summary: 'Descubra por que a pressa é inimiga da perfeição quando o assunto é queimar gordura.',
    image: 'https://picsum.photos/seed/fitness1/800/400'
  },
  {
    title: 'Como ganhar massa muscular',
    category: 'Hipertrofia',
    icon: TrendingUp,
    color: 'text-blue-500',
    summary: 'Os 3 pilares fundamentais para quem busca hipertrofia real e duradoura.',
    image: 'https://picsum.photos/seed/fitness2/800/400'
  },
  {
    title: 'O que comer antes do treino?',
    category: 'Alimentação',
    icon: Heart,
    color: 'text-red-500',
    summary: 'Carboidratos ou proteínas? Veja as melhores opções para ter energia máxima.',
    image: 'https://picsum.photos/seed/fitness3/800/400'
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Blog MFIT" 
        subtitle="Conteúdo exclusivo para sua evolução." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <Card key={i} className="rounded-3xl overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
            <div className="relative aspect-video">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover"
                data-ai-hint="fitness health"
              />
              <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black border-none font-bold">
                {post.category}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold leading-tight">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.summary}
              </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full rounded-2xl font-bold border-2 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                Ler Matéria Completa
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}