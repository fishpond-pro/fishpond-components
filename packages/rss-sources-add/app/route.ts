import { Metadata } from 'next';
import { redirect } from 'next/navigation'

export const GET = () => {
  redirect('/main')
}