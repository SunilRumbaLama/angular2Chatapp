import { NepalChatAppPage } from './app.po';

describe('nepal-chat-app App', function() {
  let page: NepalChatAppPage;

  beforeEach(() => {
    page = new NepalChatAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
