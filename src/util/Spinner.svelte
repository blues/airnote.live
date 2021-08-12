<div class="loading"></div>

<style>
  .loading {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgb(70, 124, 162);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
    -webkit-animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
</style>
