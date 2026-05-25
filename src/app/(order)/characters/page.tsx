import { redirect } from 'next/navigation';

// /characters was the legacy second step; character selection is now combined
// into /details. Keep the URL alive as a redirect for any cached bookmarks.
export default function CharactersRedirect() {
  redirect('/details');
}
