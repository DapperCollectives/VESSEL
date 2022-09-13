const REVV = ({ width = "24", height = "24", className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM13.5423 2.0555L13.5423 2.05551C13.7547 2.10083 13.9674 2.14621 14.1784 2.19844L14.2265 2.21001C14.36 2.24192 14.5005 2.2755 14.6041 2.35163C14.8426 2.52848 15.0688 2.82459 14.9722 3.0765C14.8985 3.26933 14.7285 3.19836 14.5607 3.12836C14.4897 3.0987 14.419 3.06922 14.3563 3.06005C13.7199 2.96751 13.2521 2.66214 13.0845 2H13.2891V2.00103C13.3733 2.01946 13.4578 2.03748 13.5423 2.0555ZM21.712 11.743C21.768 11.6606 21.8234 11.5789 21.8815 11.5146V10.9008C21.8697 10.8429 21.8587 10.7848 21.8478 10.7267C21.8244 10.6022 21.8009 10.4779 21.7694 10.3559C21.761 10.3234 21.7561 10.2873 21.751 10.2508C21.7363 10.1437 21.721 10.0328 21.6183 9.99912C21.5026 9.96104 21.4522 10.049 21.4021 10.1363C21.3806 10.1739 21.3591 10.2114 21.3324 10.2387C21.06 10.5153 20.9942 10.8628 21.0445 11.2288C21.0584 11.3274 21.0483 11.4432 21.0382 11.5582C21.0169 11.8007 20.9958 12.0402 21.2008 12.11C21.4139 12.1822 21.5648 11.9598 21.712 11.743ZM21.2245 14.0234C21.6923 13.8146 21.8065 13.3921 21.8815 12.9458H21.8825V12.0256C21.7836 12.0172 21.7075 12.0648 21.6281 12.1144L21.6039 12.1295C21.0963 12.4434 21.0259 12.9397 20.9555 13.4362C20.938 13.5591 20.9206 13.6821 20.8965 13.8023C20.8938 13.8155 20.8906 13.8289 20.8874 13.8424C20.8664 13.9303 20.8443 14.0229 20.9397 14.0799C21.0198 14.1278 21.0953 14.0888 21.1698 14.0503L21.1698 14.0503C21.1881 14.0409 21.2063 14.0315 21.2245 14.0234ZM12.8526 2.19921L12.8526 2.1992C12.7873 2.13372 12.7222 2.06839 12.6752 2.00098V2.002H11.0383C11.3087 2.53768 11.7406 2.80398 12.3421 2.74434C12.4314 2.73534 12.5334 2.76052 12.6336 2.78525C12.8195 2.83111 12.9991 2.87542 13.0793 2.69705C13.1631 2.51048 13.0075 2.35443 12.8526 2.19921ZM20.9294 12.114C20.8841 16.9156 16.7097 21.4108 11.2142 20.946C6.73031 20.5677 2.83354 16.7583 3.06179 11.4899C3.27668 6.52799 7.40891 2.68571 12.3853 2.93453C17.5662 3.19363 20.951 7.52635 20.9294 12.114ZM19.3223 12.0092C19.3851 7.67851 15.8235 4.3678 11.8588 4.45314C7.85924 4.53848 4.58143 7.82863 4.60714 11.857C4.6349 16.1517 7.87467 19.4871 11.9915 19.4603C16.0353 19.4346 19.348 16.0674 19.3223 12.0092ZM2.70506 9.89631C2.17453 10.1708 1.97403 10.6273 2.00693 11.0859V11.0869C2.00693 11.1573 2.00622 11.2109 2.00564 11.2541V11.2541C2.00467 11.3263 2.0041 11.369 2.00796 11.4108C2.01171 11.452 2.00827 11.4969 2.00481 11.542C1.99594 11.6579 1.98698 11.7749 2.09947 11.8334C2.24646 11.9096 2.34109 11.8076 2.43142 11.7102C2.46051 11.6788 2.48916 11.6479 2.51896 11.6236C2.93996 11.2798 2.97711 10.8016 3.01365 10.3314C3.02289 10.2125 3.03209 10.0941 3.04744 9.97856C3.07829 9.74516 2.83564 9.82845 2.70506 9.89631ZM2.87985 12.6025C2.93846 13.0251 2.87369 13.4466 2.52102 13.7839C2.51266 13.7918 2.50439 13.8 2.49615 13.8082C2.41937 13.8841 2.34639 13.9563 2.24239 13.8096C1.8887 13.3109 1.95758 12.4041 2.39044 11.9959C2.41115 11.9764 2.43159 11.9541 2.45235 11.9315C2.53774 11.8385 2.62863 11.7395 2.76676 11.8016C2.89226 11.8575 2.88545 11.9757 2.87878 12.0916C2.87637 12.1333 2.87399 12.1747 2.8778 12.2128C2.8854 12.2917 2.88371 12.3714 2.88179 12.4621L2.88179 12.4621C2.88085 12.506 2.87987 12.5524 2.87985 12.6025ZM4.13208 5.81767C3.95216 6.05929 4.15368 6.09425 4.47241 6.09528V6.09631C4.77778 6.10145 5.01323 5.95442 5.66509 5.25115C5.68809 5.22613 5.71799 5.20265 5.7484 5.17878C5.84169 5.10555 5.9398 5.02854 5.85839 4.89129C5.77819 4.75454 5.59929 4.7494 5.44403 4.74529L5.43763 4.74513C5.26767 4.74104 5.08267 4.73659 4.96285 4.8625C4.6729 5.16787 4.38399 5.4794 4.13208 5.81767ZM4.59995 6.48488C4.55368 6.90952 3.66534 7.79066 3.21912 7.84104L3.19878 7.8433C3.10071 7.85443 3.01209 7.86448 2.99189 7.72691C2.91683 7.22722 3.89154 6.20728 4.38506 6.26691L4.40505 6.26934C4.52134 6.28324 4.63016 6.29626 4.60098 6.48591L4.59995 6.48488ZM20.6251 8.83146C20.6245 8.86391 20.6237 8.90441 20.6209 8.95767L20.6199 8.95664C20.6396 9.03733 20.66 9.12432 20.6815 9.21574L20.6815 9.21578C20.7386 9.4587 20.8031 9.73291 20.88 10.0033C20.9437 10.2275 21.0548 10.2583 21.2296 10.064C21.6542 9.59308 21.5401 9.09956 21.318 8.6009C21.292 8.54226 21.2756 8.46803 21.2591 8.39317C21.2189 8.21077 21.1778 8.02458 20.9941 8.05083C20.7746 8.08218 20.7153 8.35405 20.6629 8.59395C20.6534 8.63725 20.6442 8.67952 20.6343 8.71914C20.6267 8.74878 20.6261 8.77997 20.6251 8.83146ZM19.5305 17.6639H19.5305C19.4151 17.662 19.3051 17.6603 19.3202 17.477C19.346 17.1521 20.1891 16.2185 20.5489 16.1188C20.5709 16.1127 20.5937 16.105 20.6168 16.0971C20.7113 16.0651 20.8116 16.031 20.8892 16.1013C21.0073 16.2077 20.93 16.3267 20.8666 16.4242L20.8666 16.4243C20.8571 16.4388 20.848 16.4528 20.8399 16.4663C20.7771 16.5705 20.723 16.6826 20.6688 16.7948C20.4877 17.17 20.3061 17.5463 19.8004 17.6302C19.75 17.6387 19.6996 17.6484 19.6523 17.6575L19.6071 17.6662V17.6672C19.5822 17.6647 19.5562 17.6643 19.5305 17.6639ZM2.63214 9.73809C3.03724 9.5777 3.68293 8.55364 3.65414 8.15471H3.65311C3.64694 7.94393 3.53385 7.95421 3.4043 7.96964C2.89432 8.02824 2.16741 9.20139 2.34425 9.68874C2.40059 9.84303 2.49129 9.80148 2.58182 9.75999C2.59867 9.75227 2.61552 9.74455 2.63214 9.73809ZM3.3373 15.0023C3.33404 15.032 3.33191 15.0553 3.33014 15.0747C3.32745 15.1041 3.3256 15.1243 3.32187 15.1442L3.31113 15.2022C3.26319 15.4634 3.20239 15.7947 2.98258 15.831C2.77183 15.8654 2.72241 15.6613 2.67482 15.4647C2.65693 15.3908 2.6393 15.318 2.61346 15.2593C2.40783 14.7936 2.3009 14.3216 2.68749 13.8816C2.69662 13.8712 2.70567 13.8604 2.71477 13.8495C2.77237 13.7807 2.83234 13.709 2.92911 13.7233C3.03733 13.739 3.05901 13.8354 3.07949 13.9265L3.08642 13.9566C3.13766 14.1733 3.19 14.3903 3.24034 14.5991L3.24039 14.5993L3.24039 14.5993C3.27389 14.7381 3.30649 14.8733 3.3373 15.0023ZM19.6736 17.8263C19.6455 17.829 19.6175 17.8316 19.5917 17.8296C19.0817 17.7791 18.7944 18.0927 18.5085 18.4046C18.4394 18.4801 18.3704 18.5554 18.2983 18.6254C18.2747 18.6484 18.2465 18.6707 18.2177 18.6934C18.1202 18.7707 18.0159 18.8532 18.0587 18.9843C18.1113 19.1453 18.2682 19.1438 18.4095 19.1425C18.4423 19.1422 18.4743 19.1419 18.5039 19.1436C18.9999 19.1707 19.2338 18.8501 19.4677 18.5294C19.5631 18.3987 19.6585 18.2679 19.7717 18.1607C19.8395 18.0959 19.9249 17.9972 19.8683 17.8913C19.8257 17.8121 19.7488 17.8193 19.6736 17.8263ZM11.9844 21.9743C11.5299 22.0772 11.1526 21.8828 10.8976 21.4345C10.8297 21.3142 10.7506 21.1323 10.9654 21.1292C11.0471 21.1278 11.1295 21.1245 11.2121 21.1211C11.7017 21.101 12.1994 21.0807 12.5961 21.4818C12.617 21.5029 12.6411 21.5236 12.6655 21.5447L12.6656 21.5447C12.7605 21.6263 12.8619 21.7134 12.8079 21.8499C12.7553 21.9818 12.6302 21.977 12.5095 21.9724H12.5094H12.5094H12.5094H12.5094H12.5094H12.5094H12.5093H12.5093H12.5093H12.5093H12.5093H12.5093H12.5092H12.5092H12.5092H12.5092H12.5092H12.5092H12.5091C12.4718 21.971 12.435 21.9696 12.4008 21.9723C12.3228 21.9791 12.2439 21.9778 12.1468 21.9761H12.1468H12.1467H12.1467H12.1467H12.1467H12.1466H12.1466H12.1466L12.1464 21.9761C12.0977 21.9752 12.0444 21.9743 11.9844 21.9743ZM4.17018 16.9848L4.17024 16.9844V16.9854L4.17018 16.9848ZM3.86546 16.1652C4.00291 16.4271 4.13966 16.6877 4.17018 16.9848C4.16727 17.0049 4.16518 17.0238 4.16319 17.0417C4.15889 17.0805 4.15506 17.1149 4.14454 17.1479C4.12856 17.1992 4.12042 17.2584 4.11223 17.3178C4.09091 17.4727 4.06926 17.6299 3.90806 17.6589C3.75631 17.6866 3.68998 17.5401 3.62733 17.4017C3.60636 17.3554 3.5858 17.3099 3.56259 17.2723C3.53698 17.231 3.51073 17.1898 3.48445 17.1485C3.23861 16.7625 2.99031 16.3726 3.23461 15.8719C3.24632 15.8479 3.25657 15.8216 3.26695 15.795C3.30666 15.6933 3.34806 15.5873 3.47931 15.584C3.59983 15.5814 3.64207 15.6879 3.68009 15.7837C3.68651 15.7999 3.69281 15.8158 3.69934 15.8308C3.74958 15.9444 3.80758 16.0549 3.86546 16.1652ZM5.35064 18.8578C5.33758 18.8938 5.34281 18.9422 5.34829 18.9928C5.35877 19.0897 5.37017 19.195 5.25604 19.2383C5.12559 19.2881 5.0456 19.1834 4.96978 19.0843C4.947 19.0545 4.9246 19.0252 4.90132 19.0007C4.72448 18.8157 4.5538 18.6265 4.38929 18.4301C4.31424 18.3396 4.23301 18.2378 4.20422 18.1289C4.12711 17.8358 4.14973 17.477 4.37901 17.333C4.53823 17.2334 4.63338 17.3964 4.72407 17.5518C4.75871 17.6111 4.7927 17.6694 4.82935 17.7114C4.85466 17.7405 4.88038 17.7695 4.90617 17.7985C5.16218 18.0868 5.42452 18.3823 5.35166 18.8568L5.35064 18.8578ZM18.0894 19.2724H18.0894C18.04 19.2727 17.9929 19.2729 17.9539 19.265V19.266C17.5584 19.2345 17.2877 19.4326 17.0208 19.628C16.9047 19.713 16.7893 19.7975 16.6646 19.8624L16.6369 19.8764C16.5413 19.9243 16.4284 19.9808 16.4415 20.1081C16.4556 20.2376 16.5595 20.267 16.6605 20.2957L16.6606 20.2957C16.6919 20.3046 16.723 20.3134 16.751 20.325C17.2463 20.5297 17.5576 20.2597 17.8677 19.9908C17.9502 19.9192 18.0326 19.8477 18.1184 19.7852C18.145 19.7657 18.1758 19.7467 18.2073 19.7271C18.3304 19.6507 18.4657 19.5668 18.4166 19.4202C18.3659 19.2711 18.2199 19.2718 18.0894 19.2724ZM5.98011 4.64571L5.97994 4.64567C5.86518 4.62448 5.75324 4.60381 5.64244 4.57859C5.55093 4.55803 5.49438 4.51073 5.52317 4.39866C5.61468 4.04085 6.77548 3.44452 7.15488 3.57201C7.17947 3.58027 7.20589 3.58744 7.23276 3.59474L7.23277 3.59474L7.23278 3.59475C7.3565 3.62835 7.48984 3.66457 7.49829 3.82083C7.50473 3.94561 7.39771 3.99601 7.29666 4.0436C7.26866 4.05679 7.24111 4.06976 7.21657 4.08404C7.11469 4.14374 7.01839 4.21276 6.92212 4.28177L6.92211 4.28178L6.92211 4.28178C6.74149 4.41125 6.56095 4.54067 6.34365 4.60841C6.28608 4.6259 6.22747 4.63874 6.17002 4.65133L6.17002 4.65133C6.14642 4.6565 6.12303 4.66162 6.09998 4.66701V4.66804C6.05964 4.66039 6.0197 4.65302 5.98011 4.64571ZM19.7992 6.94683L19.7974 7.01022L19.7964 7.0092C19.8091 7.2425 19.9338 7.46706 20.064 7.70168L20.064 7.7017C20.1335 7.8269 20.2046 7.95498 20.2611 8.08878L20.2701 8.11051C20.3046 8.19511 20.3449 8.29371 20.4565 8.2975C20.5776 8.30254 20.6203 8.21198 20.6616 8.12426L20.6616 8.12424C20.6708 8.10472 20.6799 8.08534 20.6899 8.06719C20.9726 7.54796 20.7166 7.12127 20.4349 6.71308C20.4 6.66241 20.3707 6.59643 20.341 6.52957C20.2645 6.35766 20.1854 6.18 20.0041 6.24218C19.817 6.30678 19.8081 6.62814 19.7992 6.94683ZM21.5586 14.1333C21.6234 14.9486 21.2409 15.7157 20.6754 15.8997C20.6585 15.9052 20.6413 15.9113 20.6239 15.9176C20.5265 15.9525 20.4224 15.9899 20.3361 15.9192C20.2435 15.8434 20.2848 15.752 20.3238 15.6658C20.335 15.6411 20.346 15.6167 20.3536 15.5933C20.7093 14.4932 20.8595 14.3132 21.5586 14.1333ZM16.0552 20.3048H16.0552L16.0549 20.3047C16.0237 20.301 15.9886 20.2967 15.948 20.29C15.6375 20.4042 15.291 20.5317 14.9445 20.6612C14.9241 20.6688 14.9025 20.6753 14.8806 20.682C14.7862 20.7105 14.6878 20.7404 14.6761 20.8555C14.6649 20.9608 14.7446 21.0152 14.8232 21.0688C14.8452 21.0837 14.8671 21.0987 14.8869 21.1146C15.3065 21.451 15.6722 21.2648 16.0337 21.0808L16.0337 21.0808C16.1186 21.0376 16.2032 20.9945 16.2883 20.9584C16.3187 20.9454 16.3528 20.9333 16.3881 20.9207C16.5521 20.8623 16.7416 20.7948 16.7026 20.5985C16.6736 20.451 16.5094 20.412 16.3506 20.3743C16.2958 20.3612 16.2415 20.3483 16.1937 20.3312C16.1536 20.3167 16.1106 20.3115 16.0552 20.3048ZM18.5861 5.0978C18.593 5.05492 18.5893 5.00633 18.5856 4.95747C18.5772 4.84699 18.5687 4.73509 18.6827 4.68447C18.8204 4.62294 18.9038 4.73355 18.9793 4.83356L18.9793 4.83357C18.9996 4.86056 19.0194 4.88677 19.0395 4.90861C19.1031 4.97806 19.1717 5.04522 19.2404 5.11252L19.2404 5.11253L19.2404 5.11254L19.2405 5.11255L19.2405 5.11256L19.2405 5.11257L19.2405 5.11258L19.2405 5.1126L19.2405 5.11261L19.2405 5.11262L19.2405 5.11264C19.5462 5.41192 19.8545 5.71381 19.7387 6.23084C19.7323 6.25872 19.7277 6.28888 19.723 6.31966V6.31968L19.723 6.3197C19.7042 6.44328 19.6839 6.5767 19.5423 6.61127C19.411 6.64283 19.3496 6.53345 19.2939 6.43442L19.2939 6.43437L19.2939 6.43433L19.2939 6.43428L19.2939 6.43424L19.2938 6.4342L19.2938 6.43416C19.2806 6.41071 19.2678 6.38785 19.2544 6.36759C19.1811 6.25772 19.0916 6.15627 19.002 6.05476L19.002 6.05474C18.7664 5.78769 18.5305 5.5202 18.5871 5.0978H18.5861ZM8.81128 21.1559C8.74034 20.7364 7.7533 19.8985 7.31838 19.8933C7.1878 19.8933 7.16313 19.9756 7.15696 20.0907C7.13125 20.6027 8.18513 21.4859 8.70333 21.3842C8.84606 21.356 8.83058 21.2669 8.81252 21.1631L8.81128 21.1559ZM13.9954 20.9553C14.0253 20.9611 14.0563 20.9654 14.0875 20.9697C14.1559 20.9792 14.2255 20.9888 14.2884 21.015C14.3215 21.0289 14.3571 21.0426 14.3936 21.0567C14.5942 21.134 14.8229 21.2221 14.822 21.417C14.822 21.6045 14.6315 21.6293 14.4526 21.6525C14.3931 21.6603 14.3348 21.6679 14.2853 21.6812C14.251 21.6904 14.2165 21.6999 14.182 21.7095C13.7438 21.8306 13.2982 21.9537 12.9312 21.5095C12.9138 21.4884 12.893 21.4686 12.8722 21.4488C12.8066 21.3863 12.7401 21.3231 12.7759 21.2155C12.808 21.1202 12.8924 21.1141 12.9743 21.1082L12.9744 21.1082C12.9951 21.1067 13.0156 21.1052 13.035 21.1024C13.2404 21.0704 13.4458 21.0394 13.6529 21.0081L13.9943 20.9564L13.9954 20.9553ZM9.79125 2.93249C9.84206 2.94724 9.89678 2.94632 9.9242 2.94586C9.93118 2.94574 9.93639 2.94565 9.93931 2.94586L9.94034 2.94483C10.0611 2.92939 10.1757 2.91491 10.2863 2.90093L10.2864 2.90092L10.2864 2.90092L10.2866 2.90089L10.2868 2.90087C10.5 2.87393 10.6983 2.84887 10.8965 2.82248C10.91 2.82065 10.9239 2.81913 10.938 2.8176L10.938 2.81759C11.0265 2.8079 11.1208 2.79757 11.1608 2.70527C11.2063 2.59897 11.1413 2.53181 11.0768 2.46516C11.0583 2.44607 11.0398 2.42702 11.024 2.4071C10.6508 1.94134 10.1778 2.075 9.72031 2.20763C9.66308 2.22442 9.59304 2.23465 9.52145 2.2451C9.32554 2.27372 9.11809 2.30402 9.13014 2.47496C9.14939 2.74651 9.50416 2.84931 9.77917 2.92899L9.79125 2.93249ZM6.97613 20.2151C6.97233 20.2417 6.97485 20.2715 6.97737 20.3014C6.98373 20.3767 6.99012 20.4525 6.89594 20.4783C6.83116 20.4958 6.73143 20.4495 6.66871 20.4022C6.59873 20.3503 6.52793 20.2991 6.45706 20.2479L6.45702 20.2479L6.45697 20.2478L6.45693 20.2478L6.45682 20.2477L6.45672 20.2477L6.45644 20.2475L6.45634 20.2474C6.20989 20.0692 5.96268 19.8905 5.74644 19.6814C5.54213 19.4842 5.57328 19.1894 5.60169 18.9205L5.60352 18.9031C5.61586 18.7859 5.68167 18.7242 5.81327 18.754C6.19061 18.8394 6.96174 19.8059 6.97613 20.2151ZM18.3339 4.89185C18.3313 4.85109 18.3287 4.81062 18.3332 4.77391L18.3321 4.77493C18.394 4.23986 18.0497 4.01365 17.7073 3.78874L17.7073 3.78874C17.6116 3.72582 17.5159 3.66301 17.4294 3.59356C17.4133 3.58053 17.3966 3.56607 17.3793 3.55114L17.3793 3.55112C17.2753 3.46134 17.152 3.35485 17.0295 3.44037C16.906 3.52633 16.9423 3.6616 16.9777 3.79335C16.9888 3.83493 16.9999 3.87616 17.0058 3.91538C17.0637 4.29302 17.3271 4.49304 17.5905 4.69298C17.7057 4.78047 17.8209 4.86795 17.9188 4.97029C17.9354 4.98749 17.952 5.00765 17.9691 5.02842L17.9692 5.02843C18.041 5.11567 18.1216 5.21357 18.2478 5.14713C18.3467 5.09515 18.3402 4.99262 18.3339 4.89185ZM10.4995 21.8684C10.3585 21.8173 10.2022 21.7932 10.0443 21.7689C9.64963 21.708 9.24511 21.6457 9.04463 21.1559C9.03583 21.1344 9.02579 21.1126 9.01565 21.0905C8.9666 20.9838 8.91533 20.8722 8.99117 20.7734C9.073 20.6659 9.18112 20.7086 9.28378 20.7492C9.31269 20.7606 9.34117 20.7719 9.3685 20.7796C9.45067 20.8029 9.5344 20.8237 9.61817 20.8445C10.0617 20.9547 10.5065 21.0651 10.7288 21.5589C10.7335 21.5696 10.7387 21.5807 10.7439 21.5921L10.744 21.5921L10.7441 21.5924C10.7752 21.6594 10.8102 21.7349 10.7936 21.7903C10.7656 21.8869 10.6883 21.8799 10.5995 21.8717C10.5674 21.8688 10.5338 21.8657 10.5005 21.8674L10.4995 21.8684ZM7.90463 3.5709H7.90464H7.90465C7.92586 3.57132 7.94918 3.57177 7.97544 3.57314C8.22752 3.56971 8.45895 3.46487 8.69364 3.35855C8.81026 3.30572 8.92769 3.25252 9.04885 3.21122C9.35114 3.10738 9.30384 2.96857 9.07558 2.79687C8.61037 2.44887 8.20959 2.66206 7.81368 2.87266L7.81367 2.87266C7.76508 2.89851 7.71657 2.92431 7.66802 2.94904C7.62615 2.97049 7.57486 2.98804 7.52232 3.00603C7.36583 3.05958 7.19821 3.11695 7.23516 3.29245C7.27297 3.4689 7.48176 3.50527 7.67241 3.53848C7.71506 3.54591 7.7568 3.55318 7.79551 3.56183C7.8278 3.56939 7.86192 3.57006 7.90463 3.5709ZM16.7755 3.7241C16.7744 3.744 16.7743 3.76397 16.7741 3.78354C16.7732 3.89238 16.7724 3.98881 16.612 3.99142C16.2851 3.99656 15.3176 3.26656 15.2065 2.91596C15.199 2.89226 15.1887 2.868 15.1782 2.84342L15.1782 2.84341C15.1413 2.75706 15.1027 2.66663 15.1788 2.5818C15.2764 2.4724 15.3992 2.53838 15.4923 2.58845L15.5068 2.59619C15.6222 2.65803 15.7483 2.7059 15.8747 2.75385C16.2358 2.89086 16.5983 3.02842 16.7149 3.49379C16.7321 3.56269 16.7508 3.63086 16.7672 3.69106L16.7766 3.72513L16.7755 3.7241ZM10.0464 9.27922C10.2478 9.28038 10.4492 9.28155 10.6506 9.28155H10.6496V9.28566C10.868 9.28566 11.0864 9.28439 11.3048 9.28311H11.3048C11.8194 9.2801 12.3339 9.27709 12.8478 9.2908C13.3578 9.30417 13.6005 9.59823 13.5974 10.1257C13.5943 10.6418 13.3794 10.8649 12.855 10.8968C12.7588 10.9026 12.6617 10.904 12.5647 10.9054H12.5647H12.5647C12.3706 10.9081 12.1768 10.9109 11.9903 10.9492C11.2778 11.0942 10.8696 11.8571 11.2593 12.4339C12.1641 13.7747 13.1141 15.0876 14.1474 16.3338C14.4703 16.7224 14.9196 16.7307 15.3586 16.4829C15.9159 16.1682 16.03 15.5431 15.6116 14.9396C15.1838 14.3237 14.7345 13.7233 14.2801 13.1269C14.0909 12.8781 14.0374 12.7043 14.3736 12.5326C14.6471 12.3938 14.8733 12.18 15.0502 11.9209C15.7267 10.9297 15.8809 9.86144 15.3885 8.76952C14.8908 7.66732 13.9089 7.25502 12.7666 7.21595C12.0096 7.19055 11.2516 7.19589 10.4937 7.20122H10.4936H10.4936C10.1778 7.20345 9.86205 7.20567 9.54638 7.20567C8.39483 7.20567 8.03085 7.60255 8.05347 8.75821C8.06067 9.16228 8.21798 9.29697 8.6056 9.28669C9.08588 9.27365 9.56615 9.27643 10.0464 9.27922ZM10.5479 13.3952C10.5479 13.5959 10.5488 13.7966 10.5497 13.9972C10.5517 14.4428 10.5537 14.8883 10.5459 15.3343C10.5315 16.1116 10.038 16.6493 9.3532 16.6565C8.6304 16.6637 8.07107 16.1394 8.0577 15.3672C8.04386 14.5449 8.04581 13.7225 8.04775 12.9002V12.8998C8.04898 12.3785 8.05022 11.8571 8.04742 11.3357C8.04537 11.0006 8.20885 10.8854 8.51935 10.8895C9.04681 10.8967 9.57426 10.8957 10.1007 10.8895C10.4215 10.8864 10.5603 11.0283 10.5551 11.3532C10.5472 11.8322 10.5489 12.3106 10.5506 12.7892C10.5513 12.9908 10.5521 13.1924 10.5521 13.3941H10.5479V13.3952Z"
      fill="black"
    />
  </svg>
);
export default REVV;
