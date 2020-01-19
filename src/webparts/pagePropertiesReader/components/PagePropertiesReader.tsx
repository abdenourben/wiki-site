import * as React from 'react';
import styles from './PagePropertiesReader.module.scss';
import { IPagePropertiesReaderProps } from './IPagePropertiesReaderProps';
import { IPagePropertiesReaderState } from './IPagePropertiesReaderState';
import { escape } from '@microsoft/sp-lodash-subset';
import { Nav, INavLink } from 'office-ui-fabric-react/lib/Nav';

// @pnp/sp imports
import { sp, FieldLinks } from '@pnp/sp';
//import { taxonomy, ITerm, ITermSet, ITermStore, Terms } from '@pnp/sp-taxonomy';
import { taxonomy, ITermStore, ITermSet, ITerms, ITermData, ITerm } from "@pnp/sp-taxonomy";
import { inputProperties } from 'office-ui-fabric-react/lib/Utilities';





export interface IPTerm {
  parent?: string;
  id: string;
  name: string;
}

export interface ILink {
  key: string;
  name: string;
  url: string;
}

export interface ITaxonomyPopulatorState {
  terms: ISearchable[];
}

export interface ILinkState {
  links: ILink[];
}

export interface ISearchable {
  termGuid: string;
  label: string;
  path: any;
  subTerms: any;
}







//const searchables: ISearchable[] = []; 




export default class PagePropertiesReader extends React.Component<IPagePropertiesReaderProps, ITaxonomyPopulatorState> {



  constructor(props) {
    super(props);
    this.state = {
      terms: [],
    };
  }







  public async getTermsetWithChildren(): Promise<IPTerm[]> {
    let tms: IPTerm[] = [];

    return new Promise<any[]>((resolve, reject) => {
      //const tbatch = taxonomy.createBatch();
      return taxonomy.termStores.getByName("Taxonomy_InjkMqAvKdUBok59vNz/Mg==").get().then((resp1: ITermStore) => {
        return resp1.getTermSetById("0d6ac83c-9811-467b-91a4-872618385056").get().then((resp2: ITermSet) => {
          resp2.terms.get().then((terms:ITerm[])=>{
            terms.forEach((term:any)=>{
              //console.log(term['Name']);
              term.setLocalCustomProperty("value","key");
              term.setLocalCustomProperty("pageUrl","https://m365x873105.sharepoint.com/sites/WikiSite/SitePages/"+term['Name']+".aspx");
              //term.LocalCustomProperties;
              //console.log(term.LocalCustomProperties._Sys_Nav_FriendlyUrlSegment);
              tms.push(term);


            });
          });
          //console.log(tms);
          resolve(tms);



        });
      });

    });

  }


  public async getSearchables() {
    const date = new Date(); 
    date.setDate(date.getDate() + 1); 

    const store = await taxonomy.termStores.usingCaching().getById("a99d9ab5846d4dce891cd055c2b89690"); 
    const termSet = await store.usingCaching().getTermSetById("452746d5-9636-4bc5-890f-473da11b1467"); 
    const select = ['IsRoot', 'Labels', 'TermsCount', 'Id', 'Name', 'Parent']; 
    const terms = await termSet.terms.select(...select).usingCaching().get();

    const allTerms: any[] = [
      ...terms.map(term => {
        const name = 'Parent'; 
        console.log(term); 
        return {
          id: term.Id ? term.Id.substring(6, 42) : undefined, 
          isRoot: term.IsRoot, 
          name: term.Name, 
          parent: term[name] && term[name].Id ? term[name].Id.substring(6, 42): null, 
          path: "https://m365x873105.sharepoint.com/sites/WikiSite/SitePages/"+term.Name+".aspx"
        };
        
      })
    ];

    const searchables: ISearchable[] = []; 
    const rootTerms = allTerms.filter((t) => t.isRoot === true);
    const childTerms = allTerms
      .filter((t) => t.isRoot === false && t.parent)
      .sort((a,b) => a.parent - b.parent); 

    rootTerms.forEach((t) => {
      let term: ISearchable = { termGuid: t.id, label: t.name, path: [t.path], subTerms: [] }; 
      term = this.recursiveAdd(term, childTerms); 
      term.path = [t.path]; 
      searchables.push(term); 
    });
    //this.searchables = searchables; 
    console.log(searchables); 
    return(searchables) ; 
  }


  private recursiveAdd(currentTerm: any, allTerms: any): any {
    const subs = allTerms.filter((t) => {
      return t.parent != null && currentTerm.termGuid === t.parent;
    });

    if (subs != null && subs.length > 0) {
      currentTerm.subTerms = []; 
      subs.forEach((s) => {
        const sub: ISearchable = { termGuid: s.id, label: s.name, path: ["https://m365x873105.sharepoint.com/sites/WikiSite/SitePages/"+s.name+".aspx"], subTerms: [] };
        this.recursiveAdd(sub, allTerms); 
        //sub.path.pop(); 
        currentTerm.subTerms.push(sub);
      });
    }

    return currentTerm;
  }
  

  public componentDidMount() {
    this.getSearchables().then((res: ISearchable[]) => {
      this.setState({
        terms: res
      });
    });
    //this.getSearchables(); 
  }

  public render(): React.ReactElement<IPagePropertiesReaderProps> {


    let tab: any [] ;
    this.state.terms.forEach(t => {
      let ep = {
        link : t.path,
        label : t.label, 
      }; 
      tab.push(ep); 
    }); 

    console.log(tab); 

  return (
    <div className={styles.pagePropertiesReader}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.title}> terms of termstore </span>      
          </div>
        </div>
        <Nav
          styles={{ root: { width: 300 } }}
          ariaLabel="Nav example similiar to one found in this demo page"
          groups={[
            {
              name: "try",
              //expandAriaLabel: 'Expand Basic components section',
              //collapseAriaLabel: 'Collapse Basic components section',
              links: tab
            },
            {
              name: 'Extended components',
              //expandAriaLabel: 'Expand Extended components section',
              //collapseAriaLabel: 'Collapse Extended components section',
              links: [
                {
                  key: 'ColorPicker',
                  name: 'ColorPicker',
                  url: '#/examples/colorpicker'
                }
              ]
            }
          ]}
        /> 
      </div>
    </div>

    )

    function _onLinkClick(ev: React.MouseEvent<HTMLElement>, item?: INavLink) {
      if (item && item.name === 'News') {
        alert('News link clicked');
      }
    }

  }
}