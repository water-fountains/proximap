import {NgxGalleryAnimation} from 'ngx-gallery';

let galleryOptions = [{
  width: '100%',
  height: '500px',
  thumbnailsColumns: 4,
  imagePercent: 80,
  thumbnailPercent: 20,
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
