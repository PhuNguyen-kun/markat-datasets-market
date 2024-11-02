<template>
  <div class="footer">
    <div class="container">
      <div class="footer__column">
        <div class="footer__column-heading">Intro</div>
        <ul class="footer__column-items">
          <li><a href="#!">About Us</a></li>
          <li><a href="#!">Products</a></li>
          <li><a href="#!">Discount</a></li>
          <li><a href="#!">Recruitment</a></li>
        </ul>
      </div>

      <div class="footer__column">
        <div class="footer__column-heading">Contact</div>
        <div class="footer__address">
          <p>Hanoi University of Science and Technology</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  flex-wrap: wrap;
  box-sizing: border-box;
  max-height: 90px;
  border: none;

  &__column {
    flex: 1;
    min-width: 150px;
    color: #fff;
    letter-spacing: 0.005cm;

    &:first-of-type {
      margin-left: 200px;
    }

    &-heading {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 12px;
      margin-top: 30px;
    }

    &-items {
      a {
        color: #fff;
        line-height: 20px;
        font-size: 11px;
      }

      li {
        margin-top: 5px;
      }
    }
  }

  &__address {
    p {
      width: 295px;
      font-size: 12px;
      letter-spacing: 0.005cm;
      line-height: 1.5;
    }
  }

  &__fb-banner {
    width: 270px;
    height: 130px;
    object-fit: cover;
  }

  &__social {
    display: flex;
    gap: 20px;
    margin-top: 30px;

    a {
      display: flex;
      width: 30px;
      height: 30px;
    }

    .footer-instagram {
      margin-top: -2px;
      width: 35px;
      height: 35px;
      object-fit: cover;
    }
  }

  .container {
    display: flex;
  }
}
</style>
