
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const { data: members } = await supabase.from('members').select()

  return (
    <ul>
      {members?.map((member) => (
        <li key={member.user_id}>{member.first_name} {member.last_name}</li>
      ))}
    </ul>
  )
}
