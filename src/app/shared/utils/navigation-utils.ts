import {NavigationPath} from "../enums/navigation-path.enum";

export interface INavigationParameter {
  [index: string]: {
    value: any
  };
}

/**
 * return the Url to navigate, by replacing the url enums parameters by the navigation parameter values
 */
export class NavigationUtils {
  public static getNavigationURL(url: NavigationPath, navigationParameter: INavigationParameter): string {
    let tmpUrl: string = url.toString();

    Object.keys(navigationParameter).forEach((parameterName) => {
      tmpUrl = tmpUrl.replace(`{{${parameterName}}}`, navigationParameter[parameterName].value);
    });

    return tmpUrl;
  }

  public static getNavigationURLByString(url: string, navigationParameter: INavigationParameter): string {

    Object.keys(navigationParameter).forEach((parameterName) => {
      url = url.replace(`{{${parameterName}}}`, navigationParameter[parameterName].value);
    });

    return url;
  }
}
