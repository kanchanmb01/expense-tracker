package com.example.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.demo.entities.User;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret}")
	private String SECRET_KEY;
	
    private final long EXPIRATION_TIME = 1000 * 60 * 5; //5 mins
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    public String generateToken(User user) { // Use email as username
    	 	return Jwts.builder()
    	 	 .setSubject(user.getEmail()) //identity of user
    	 	 .claim("userId", user.getUserId())
         .setIssuedAt(new Date(System.currentTimeMillis()))
         .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
         .signWith(getSigningKey(), SignatureAlgorithm.HS256)
         .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final Integer tokenUserId = extractUserId(token);
        
        return username.equals(userDetails.getUsername())
        	       && tokenUserId != null
        	       && !isTokenExpired(token);
    }
    
    private Boolean isTokenExpired(String token) {
    		//final Date expiration = extractAllClaims(token).getExpiration();
    	
         return extractExpiration(token).before(new Date());
    }
    
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Integer extractUserId(String token) {
        return extractAllClaims(token).get("userId", Integer.class);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
 	   return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token) //validates signature,expiration & token structure
                .getBody();
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}