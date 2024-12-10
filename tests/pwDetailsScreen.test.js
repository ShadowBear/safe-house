import { describe, test, vi, expect } from "vitest";
import { updatePwData, getPwDataWithId } from "../utils/databaseHelper";
import { encryptData } from "../utils/crypoHelper";
import { updatePwDataHandler } from "../screens/pwDetailScreen";

// Mock dependencies
vi.mock("../utils/databaseHelper", () => ({
  getPwDataWithId: vi.fn(),
  updatePwData: vi.fn(),
}));

vi.mock("../utils/crypoHelper", () => ({
  encryptData: vi.fn(),
}));

// Mock the context and helper methods
const mockSetAccountList = vi.fn();
const mockAuthCtx = {
  key: "mockKey",
};

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useContext: () => mockAuthCtx,
  };
});

// The test suite
describe("updatePwDataHandler", () => {
  test("successfully updates password data", async () => {
    // Mock input data
    const updatedPwData = {
      id: "123",
      userName: "updatedUser",
      password: "newPassword",
    };

    const pwDataCollectionId = "collection123";
    const originalDataRef = {
      pwData: [
        { id: "123", userName: "originalUser", password: "oldPassword" },
        { id: "456", userName: "otherUser", password: "otherPassword" },
      ],
    };

    const encryptedPassword = "encryptedNewPassword";

    // Mock implementations
    getPwDataWithId.mockResolvedValue(originalDataRef);
    encryptData.mockResolvedValue(encryptedPassword);
    updatePwData.mockResolvedValue(true);

    const accountList = [
      { id: "123", pwData: originalDataRef.pwData },
      { id: "456", pwData: [] },
    ];

    // Call the function
    await updatePwDataHandler({
      updatedPwData,
      pwDataCollectionId,
      accountList,
      setAccountList: mockSetAccountList,
      authCtx: mockAuthCtx,
    });

    // Assertions
    expect(getPwDataWithId).toHaveBeenCalledWith(pwDataCollectionId);
    expect(encryptData).toHaveBeenCalledWith(
      updatedPwData.password,
      mockAuthCtx.key
    );

    // Ensure dataRef was modified correctly
    expect(originalDataRef.pwData[0].userName).toBe("updatedUser");
    expect(originalDataRef.pwData[0].password).toBe(encryptedPassword);

    expect(updatePwData).toHaveBeenCalledWith(
      pwDataCollectionId,
      originalDataRef
    );

    // Ensure setAccountList is updated
    expect(mockSetAccountList).toHaveBeenCalledWith([
      {
        id: "123",
        pwData: [
          { id: "123", userName: "updatedUser", password: encryptedPassword },
          { id: "456", userName: "otherUser", password: "otherPassword" },
        ],
      },
      { id: "456", pwData: [] },
    ]);
  });

  test("handles errors gracefully", async () => {
    const updatedPwData = {
      id: "123",
      userName: "updatedUser",
      password: "newPassword",
    };

    const pwDataCollectionId = "collection123";

    // Mock implementations to throw an error
    getPwDataWithId.mockRejectedValue(new Error("Mocked error"));

    console.error = vi.fn(); // Mock console.error

    await updatePwDataHandler({
      updatedPwData,
      pwDataCollectionId,
      accountList: [],
      setAccountList: mockSetAccountList,
      authCtx: mockAuthCtx,
    });

    expect(console.error).toHaveBeenCalledWith(
      "Error while updating data: ",
      expect.any(Error)
    );
  });
});
