import { Idemo100putPage } from './app.po';

describe('idemo100put App', function() {
  let page: Idemo100putPage;

  beforeEach(() => {
    page = new Idemo100putPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
