import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChatMessagesComponent } from './view-chat-messages.component';

describe('ViewChatMessagesComponent', () => {
  let component: ViewChatMessagesComponent;
  let fixture: ComponentFixture<ViewChatMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChatMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
