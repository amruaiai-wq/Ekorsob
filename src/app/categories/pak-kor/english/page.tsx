// src/app/categories/pak-kor/english/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function PakKorEnglishPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'pak-kor')
    .eq('subcategory', 'english')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ภาษาอังกฤษ"
      icon="🇬🇧"
      description="ทักษะภาษาอังกฤษ Grammar และ Vocabulary"
      backLink="/categories/pak-kor"
      backText="กลับไป ภาค ก."
      color="indigo"
      tests={tests || []}
      error={error}
      questionCount={25}
    />
  )
}