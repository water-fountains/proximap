/*
* @license
* (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
* Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
* and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
*/
import {NgxGalleryAnimation} from 'ngx-gallery';
//currently this is https://lukasz-galka.github.io/ngx-gallery-demo/ 

let galleryOptions = [{
  width: '100%',
  height: '500px',
  thumbnailsColumns: 4,
  imagePercent: 80,
  thumbnailsPercent: 20,
  thumbnailsRows: 1,

  imageAnimation: NgxGalleryAnimation.Slide,
  imageAutoPlay: false,
  imageAutoPlayInterval: 4000,
  imageAutoPlayPauseOnHover: true,
  imageDescription: true,
  imageSwipe: false,
  imageArrowsAutoHide: true,
  imageSize: 'cover',

  thumbnailsRemainingCount: true,
  thumbnailsArrowsAutoHide: false,
  thumbnailsMoveSize: 4,
  thumbnailsMargin: 0,
  thumbnailMargin: 0,

  preview: true,
  previewDownload: true,
  previewDescription: true,
  previewZoom: true,
  previewZoomStep: 0.3,
  previewCloseOnClick: true,
  previewCloseOnEsc: true,
  previewKeyboardNavigation: true,

  arrowPrevIcon: 'fa fa-chevron-left',
  arrowNextIcon: 'fa fa-chevron-right'

 }];

export { galleryOptions };
