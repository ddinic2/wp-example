import * as React from 'react';
import styles from './WpExample.module.scss';
import { IWpExampleProps } from './IWpExampleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import App from './App';

export default class WpExample extends React.Component<IWpExampleProps, {}> {
  public render(): React.ReactElement<IWpExampleProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <App/>
    );
  }
}
