import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultViewChatMessageComponent } from './default-view-chat-message.component';

describe('DefaultViewChatMessageComponent', () => {
  let component: DefaultViewChatMessageComponent;
  let fixture: ComponentFixture<DefaultViewChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultViewChatMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultViewChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
