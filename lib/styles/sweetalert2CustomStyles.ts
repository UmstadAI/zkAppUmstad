export const swalCustomStyles = `
  :root {
    --swal-bg-color: #fff; /* Light mode background */
    --swal-text-color: #000; /* Light mode text */
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --swal-bg-color: #333; /* Dark mode background */
      --swal-text-color: #fff; /* Dark mode text */
    }
  }
  .swal2-popup {
    background-color: var(--swal-bg-color) !important;
    color: var(--swal-text-color) !important;
  }
  .swal2-title {
    color: var(--swal-text-color) !important;
  }
  .swal2-content {
    color: var(--swal-text-color) !important;
  }
`;
