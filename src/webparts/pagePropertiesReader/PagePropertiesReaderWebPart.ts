import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'PagePropertiesReaderWebPartStrings';
import PagePropertiesReader from './components/PagePropertiesReader';
import { IPagePropertiesReaderProps } from './components/IPagePropertiesReaderProps';

// @pnp/sp imports
import { sp, Web } from '@pnp/sp';

export interface IPagePropertiesReaderWebPartProps {
  description: string;
}

export default class PagePropertiesReaderWebPart extends BaseClientSideWebPart<IPagePropertiesReaderWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IPagePropertiesReaderProps > = React.createElement(
      PagePropertiesReader,
      {
        description: this.properties.description,
        pageContext: this.context.pageContext,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
