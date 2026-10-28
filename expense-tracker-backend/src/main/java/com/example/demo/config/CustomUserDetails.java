package com.example.demo.config;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.entities.User;

public class CustomUserDetails implements UserDetails{
	
	 private String email;
	 private String password;
	 private Integer userId;
	 private List<GrantedAuthority> authorities;

    public CustomUserDetails(User user) { 
    		email=user.getEmail();
        password=user.getPassword();
        userId= user.getUserId();
        authorities= Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		 return authorities;
	}

	@Override
	public @Nullable String getPassword() {
		return password;
	}

	@Override
	public String getUsername() { // using username as email
		return email;
	}
	
	public Integer getUserId() {
        return userId;
    }

	@Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

}
