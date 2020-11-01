export class Commit {
  id: string;
  short_id: string;
  title: string;
  author_name: string;
  created_at: string;
  projectId: number;
  author_email: string;
  authored_date: string;
  committed_date: string;
  committer_email: string;
  committer_name: string;
  message: string;
  parent_ids: number[];
  web_url: string;
}
