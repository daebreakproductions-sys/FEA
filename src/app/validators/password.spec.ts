import { PasswordValidator } from './password.validator';

describe('Password', () => {
  it('should create an instance', () => {
    expect(new PasswordValidator()).toBeTruthy();
  });
});
