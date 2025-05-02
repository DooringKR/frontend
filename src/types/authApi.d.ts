export type User = {
  id: number;
  userType: "company" | "factory";
  phoneNumber: string;
};

export type SignupUser = Pick<User, "userType" | "phoneNumber"> 

export type SigninUser = Pick<User, "phoneNumber"> 
