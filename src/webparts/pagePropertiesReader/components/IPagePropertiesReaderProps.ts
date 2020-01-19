import { PageContext } from '@microsoft/sp-page-context';

export interface IPagePropertiesReaderProps {
  description: string;
  pageContext: PageContext;
  siteUrl: string;
}
