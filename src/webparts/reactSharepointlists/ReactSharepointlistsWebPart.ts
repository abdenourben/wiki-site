import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ReactSharepointlistsWebPartStrings';
import ReactSharepointlists from './components/ReactSharepointlists';
import { IReactSharepointlistsProps } from './components/IReactSharepointlistsProps';

export interface IReactSharepointlistsWebPartProps {
  description: string;
}

export default class ReactSharepointlistsWebPart extends BaseClientSideWebPart<IReactSharepointlistsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactSharepointlistsProps > = React.createElement(
      ReactSharepointlists,
      {
        description: this.properties.description
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
