import { apiSlice } from "./apiSlice.js";
import { USERS_URL, UPLOAD_URL } from "../constants.js";
import { setCredientials } from "../features/auth/authSlice.js";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // AUTH
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = getState().auth.userInfo;
          if (currentUser) {
            dispatch(setCredientials({ ...currentUser, ...data }));
          }
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      },
    }),

    // OTP VERIFICATION
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-account`,
        method: "POST",
        body: data,
      }),
    }),

    resendVerificationOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resend-verification-otp`,
        method: "POST",
        body: data,
      }),
    }),

    // PASSWORD RESET
    requestPasswordReset: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),

    // ADMIN & USER MANAGEMENT
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ PROFILE IMAGE UPLOADS
    uploadProfileImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data, // FormData
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = getState().auth.userInfo;
          if (currentUser) {
            dispatch(
              setCredientials({ ...currentUser, profileImage: data.image })
            );
          }
        } catch (err) {
          console.error("Profile image upload failed:", err);
        }
      },
    }),

    updateProfileImage: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/image`,
        method: "PUT",
        body: data, // { image: "/uploads/image.png" }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = getState().auth.userInfo;
          if (currentUser) {
            dispatch(
              setCredientials({
                ...currentUser,
                profileImage: data.profileImage,
              })
            );
          }
        } catch (err) {
          console.error("Update profile image failed:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useVerifyAccountMutation,
  useResendVerificationOtpMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useUploadProfileImageMutation,
  useUpdateProfileImageMutation,
} = userApiSlice;
